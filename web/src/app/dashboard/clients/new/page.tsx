import { createClient } from "../actions";

export default function NewClientPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
                <p className="text-gray-500">Adicione as informações de contato do seu novo cliente.</p>
            </div>

            <form action={createClient} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
                        <input
                            name="name"
                            required
                            placeholder="Ex: João Silva"
                            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Empresa</label>
                        <input
                            name="company"
                            placeholder="Ex: Tech Solutions"
                            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-mail de Contato</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="cliente@email.com"
                        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                    <input
                        name="phone"
                        placeholder="(11) 99999-9999"
                        className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900"
                    />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                    <a href="/dashboard/clients" className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                        Cancelar
                    </a>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        Salvar Cliente
                    </button>
                </div>
            </form>
        </div>
    );
}
