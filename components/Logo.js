import Link from "next/link"
import imagen from '../public/images/logonlnegro.png'
export default function Logo() {
    return (
      <Link href={'/'} className="flex gap-1">
        <div className="w-24 h-24">
          <img src={imagen.src} />
        </div>
      </Link>
    )
}