import {
  Camera,
  Clapperboard,
  Eye,
  FileText,
  ImageIcon,
  IndianRupee,
  type LucideIcon,
  PackagePlus,
  Tag,
  UserCheck,
} from 'lucide-react'

// Icons are named in the collection config, because a config cannot hold a component
const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  eye: Eye,
  text: FileText,
  rupee: IndianRupee,
  product: PackagePlus,
  tag: Tag,
  video: Clapperboard,
  image: ImageIcon,
  customer: UserCheck,
}

type Props = { icon?: string; step?: number; title: string; text?: string }

/**
 * A heading inside an edit form: icon (or step number), title and one line of help.
 * Added as a `ui` field, so it stores nothing. Used by the Store product and video forms.
 */
export function FormSection({ icon, step, title, text }: Props) {
  const Icon = (icon && ICONS[icon]) || Tag
  return (
    <div className="sg-form-section">
      <span aria-hidden className="sg-form-section__icon">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div className="sg-form-section__text">
        <h3 className="sg-form-section__title">
          {step !== undefined && <span className="sg-form-section__step">{step}</span>}
          {title}
        </h3>
        {text && <p className="sg-form-section__help">{text}</p>}
      </div>
    </div>
  )
}
