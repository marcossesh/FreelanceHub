export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <p className="text-gray-600">Bem-vindo ao seu painel de controle.</p>

            {/* Cards de métricas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
            </div>
        </div>
    );
}
