import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ProjectReport {
    name: string;
    clientName: string;
    status: string;
    value: number;
    createdAt: Date;
}

export function generateProjectsPDF(projects: ProjectReport[]) {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Relatório de Projetos', 14, 22);

    // Data de geração
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);

    // Preparar dados da tabela
    const tableData = projects.map(project => [
        project.name,
        project.clientName,
        project.status,
        `R$ ${project.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        new Date(project.createdAt).toLocaleDateString('pt-BR')
    ]);

    autoTable(doc, {
        head: [['Projeto', 'Cliente', 'Status', 'Valor', 'Data Criação']],
        body: tableData,
        startY: 40,
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 5,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    const totalValue = projects.reduce((sum, p) => sum + p.value, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
        `Total: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        14,
        finalY
    );

    // Baixar o arquivo
    doc.save(`projetos-${new Date().getTime()}.pdf`);
}
