import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadProjectsPDF(projects: any[], selectedFields: string[]) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('Relatório de Projetos e Faturamento', 14, 20);

    const fieldLabels: Record<string, string> = {
        name: "Projeto",
        client: "Cliente",
        status: "Status",
        value: "Total Contrato",
        paid: "Pago",
        pending: "Pendente",
        createdAt: "Data"
    };

    const activeColumns = selectedFields.filter(field => field !== 'description');
    const headers = activeColumns.map(field => fieldLabels[field] || field);

    const tableData: any[] = [];

    projects.forEach(p => {

        const paidAmount = p.paidValue ?? (p.invoices?.filter((i: any) => i.status === "PAID").reduce((acc: number, i: any) => acc + i.totalAmount, 0) || 0);
        const pendingAmount = p.pendingValue ?? (p.invoices?.filter((i: any) => i.status !== "PAID").reduce((acc: number, i: any) => acc + i.totalAmount, 0) || 0);
        const clientName = p.clientName ?? p.client?.name ?? '';
        const totalValue = p.totalValue ?? p.value ?? 0;

        const dataRow = activeColumns.map(field => {
            if (field === 'client') return clientName;
            if (field === 'value') return `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            if (field === 'paid') return `R$ ${paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            if (field === 'pending') return `R$ ${pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            if (field === 'createdAt') return new Date(p.createdAt).toLocaleDateString('pt-BR');
            if (field === 'status') return p.status === "COMPLETED" ? "Finalizado" : "Em Andamento";
            return p[field];
        });

        tableData.push(dataRow);

        // Linha de descrição (se selecionada)
        if (selectedFields.includes('description')) {
            tableData.push([{
                content: `Descrição: ${p.description || 'Sem descrição'}`,
                colSpan: activeColumns.length,
                styles: { fontSize: 9, fontStyle: 'italic', textColor: [100, 100, 100], fillColor: [252, 252, 252] }
            }]);
        }
    });

    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold' },
        theme: 'striped',
        styles: { fontSize: 9 },
        didParseCell: (data) => {
            if (data.section === 'body' && data.cell.colSpan === 1) {
                const fieldId = activeColumns[data.column.index];

                if (fieldId === 'paid') {
                    data.cell.styles.textColor = [34, 197, 94];
                    data.cell.styles.fontStyle = 'bold';
                }
                if (fieldId === 'pending') {
                    data.cell.styles.textColor = [239, 68, 68];
                }
            }
        }
    });

    doc.save(`relatorio-financeiro-${Date.now()}.pdf`);
}
