export const PALETTE = [
  '#FDE68A', // yellow
  '#FED7AA', // peach
  '#FDB17D', // orange
  '#FCA5A5', // red
  '#FDA4AF', // rose
  '#F9A8D4', // pink
  '#C4B5FD', // purple
  '#A5B4FC', // indigo
  '#93C5FD', // blue
  '#7DD3FC', // sky
  '#67E8F9', // cyan
  '#6EE7B7', // teal
  '#86EFAC', // green
  '#BEF264', // lime
  '#D1D5DB', // gray
  '#E7E5E4', // stone
]

interface ColorPickerProps {
  current: string | undefined
  onSelect: (color: string) => void
  onClose: () => void
}

export default function ColorPicker({ current, onSelect, onClose }: ColorPickerProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-base font-bold text-center">Card color</h2>
        <div className="flex justify-center gap-3 flex-wrap">
          {PALETTE.map(color => (
            <button
              key={color}
              onClick={() => { onSelect(color); onClose() }}
              className="h-10 w-10 rounded-full border-[3px] active:scale-95 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: current === color ? '#374151' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
