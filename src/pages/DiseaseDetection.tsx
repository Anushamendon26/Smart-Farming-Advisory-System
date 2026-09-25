import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { AlertTriangle, Camera, ImageUp, ScanSearch, Trash2 } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardTitle } from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Loading'
import { ErrorState } from '../components/ui/States'
import { detectDisease } from '../services/diseaseService'
import type { DiseaseResult } from '../types'

type Stage = 'idle' | 'preview' | 'analyzing' | 'result'

const severityBadgeTone = (s: DiseaseResult['severity']) =>
  s === 'Severe' ? 'danger' : s === 'Moderate' ? 'warning' : 'success'

export default function DiseaseDetection() {
  const [stage, setStage] = useState<Stage>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const acceptFile = useCallback((f: File | null) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('That file is not an image. Please take or choose a photo of the plant.')
      return
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setStage('preview')
  }, [])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    acceptFile(e.dataTransfer.files?.[0] ?? null)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => acceptFile(e.target.files?.[0] ?? null)

  const analyze = async () => {
    if (!file) return
    setStage('analyzing')
    setError('')
    try {
      // The file object is passed straight to the service layer, which will
      // forward it to the computer-vision model once the API is connected.
      const r = await detectDisease(file)
      setResult(r)
      setStage('result')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.')
      setStage('preview')
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    setStage('idle')
    if (inputRef.current) inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Plant Disease Detection"
        description="Take or upload a photo of your plant or leaf to identify possible diseases."
        action={<Badge tone="warning">Demo results</Badge>}
      />

      {error && <div className="mb-6"><ErrorState title="Image problem" message={error} /></div>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload panel */}
        <Card>
          <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" id="plant-image" />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
            className="hidden"
            id="plant-camera"
            aria-hidden
            tabIndex={-1}
          />

          {stage !== 'result' && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl2 border-2 border-dashed p-6 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary-light' : 'border-gray-200 bg-background'
              }`}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Selected plant preview"
                    className="max-h-64 w-full rounded-xl object-contain"
                  />
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button size="lg" onClick={analyze} disabled={stage === 'analyzing'}>
                      {stage === 'analyzing' ? (
                        'Analyzing…'
                      ) : (
                        <>
                          <ScanSearch size={20} aria-hidden /> Analyze Plant
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="ghost" onClick={reset}>
                      <Trash2 size={18} aria-hidden /> Remove
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Camera size={32} aria-hidden />
                  </span>
                  <p className="text-xl font-bold text-ink">Add a Plant Photo</p>
                  <p className="text-base text-muted">Drag &amp; drop your image here</p>
                  <p className="text-sm text-muted">— or —</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="primary" size="lg" onClick={() => cameraRef.current?.click()}>
                      <Camera size={20} aria-hidden /> Take Photo
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
                      <ImageUp size={20} aria-hidden /> Upload from Gallery
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-muted">Clear, well-lit photos of a single leaf work best.</p>
                </>
              )}
            </div>
          )}

          {stage === 'analyzing' && <Spinner label="Running image analysis…" />}
        </Card>

        {/* Result panel */}
        <div>
          {stage === 'analyzing' ? (
            <Card className="flex h-full min-h-72 flex-col items-center justify-center gap-3 text-center">
              <Spinner label="The vision model is examining your plant photo…" />
              <p className="text-base text-muted">This usually takes a few seconds.</p>
            </Card>
          ) : result ? (
            <div className="space-y-5">
              <Card className="border-l-4 border-l-accent">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-medium text-muted">
                      Detected Disease <Badge tone="warning">Demo Result</Badge>
                    </p>
                    <h2 className="text-3xl font-extrabold text-ink">{result.disease}</h2>
                  </div>
                  <Badge tone={severityBadgeTone(result.severity)}>Severity: {result.severity}</Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-base">
                    <span className="font-semibold text-ink">Confidence</span>
                    <span className="font-bold text-primary">{result.confidence}%</span>
                  </div>
                  <div
                    className="h-4 overflow-hidden rounded-full bg-primary-light"
                    role="progressbar"
                    aria-valuenow={result.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Detection confidence"
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>
                {preview && (
                  <img src={preview} alt="Analyzed plant" className="mt-4 h-36 w-full rounded-xl object-cover" />
                )}
              </Card>

              <Card>
                <CardTitle>Symptoms</CardTitle>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base text-ink">
                  {result.symptoms.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </Card>

              <Card>
                <CardTitle>Possible Causes</CardTitle>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base text-ink">
                  {result.causes.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Card>

              <Card>
                <CardTitle>Recommended Actions</CardTitle>
                <ul className="mt-2 space-y-2">
                  {result.recommendedActions.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-base text-ink">
                      <span aria-hidden>✅</span> {a}
                    </li>
                  ))}
                </ul>
              </Card>

              <Button size="lg" variant="outline" fullWidth onClick={reset}>
                Scan Another Plant
              </Button>
            </div>
          ) : (
            <Card className="flex h-full min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-5xl" aria-hidden>🍃</span>
              <h3 className="text-xl font-bold text-ink">Your analysis will appear here</h3>
              <p className="max-w-sm text-base text-muted">
                Upload a leaf photo and tap “Analyze Plant”. The result will show the likely disease,
                confidence, severity and next steps.
              </p>
              <p className="mt-2 flex items-start gap-2 rounded-xl bg-accent-light p-3 text-sm text-ink">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
                Advisory only — confirm with your local agriculture officer before applying chemicals.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
