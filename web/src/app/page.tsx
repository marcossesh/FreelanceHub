import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">FreelanceHub</h1>
      <div className="mt-8 space-x-4">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Entrar
        </Link>
        <Link href="/register" className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg">
          Cadastrar
        </Link>
      </div>
    </div>
  );
}
