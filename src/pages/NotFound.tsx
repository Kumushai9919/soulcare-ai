import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4  text-center text-white">
      <AlertTriangle size={60} className="mb-4 text-red-500" />
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-6 text-lg text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-md bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
