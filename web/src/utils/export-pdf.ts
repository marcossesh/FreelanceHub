import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadProjectsPDF(projects: any[], selectedFields: string[]) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de Projetos', 14, 20);

    const fieldLabels: Record<string, string> = {
        name: "Projeto",
        client: "Cliente",
        status: "Status",
        value: "Valor",
        createdAt: "Data"
    };

    const activeColumns = selectedFields.filter(field => field !== 'description');
    const headers = activeColumns.map(field => fieldLabels[field]);

    const tableData: any[] = [];

    projects.forEach(p => {

        const dataRow = activeColumns.map(field => {
            if (field === 'client') return p.client.name;
            if (field === 'value') return `R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            if (field === 'createdAt') return new Date(p.createdAt).toLocaleDateString('pt-BR');
            return p[field];
        });

        tableData.push(dataRow);

        if (selectedFields.includes('description')) {
            tableData.push([
                {
                    content: `Descrição: ${p.description || 'Sem descrição'}`,
                    colSpan: activeColumns.length,
                    styles: {
                        fontSize: 9,
                        fontStyle: 'italic',
                        textColor: [100, 100, 100],
                        fillColor: [250, 250, 250]
                    }
                }
            ]);
        }
    });

    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        headStyles: { fillColor: [37, 99, 235] },
        theme: 'striped',

        didParseCell: (data) => {
            if (data.section === 'body' && data.cell.colSpan > 1) {
                data.cell.styles.fillColor = [252, 252, 252];
                data.cell.styles.textColor = [100, 100, 100];
            }
        }
    });

    doc.save(`relatorio-projetos-${Date.now()}.pdf`);
}
