import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ProjectReport {
    name: string;
    clientName: string;
    status: string;
    totalValue: number;
    paidValue: number;
    pendingValue: number;
    createdAt: Date;
}

export function generateProjectsPDF(projects: ProjectReport[]) {
    const doc = new jsPDF();

    // Cabeçalho Profissional
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Relatório Financeiro de Projetos', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    const tableData = projects.map(project => [
        project.name,
        project.clientName,
        project.status === "COMPLETED" ? "Finalizado" : "Em Andamento",
        `R$ ${project.paidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${project.pendingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${project.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
        head: [['Projeto', 'Cliente', 'Status', 'Recebido', 'Pendente', 'Total']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [41, 128, 185], fontStyle: 'bold' },
        columnStyles: {
            3: { textColor: [39, 174, 96], fontStyle: 'bold' },
            4: { textColor: [192, 57, 43] }
        }
    });

    const totalPaid = projects.reduce((sum, p) => sum + p.paidValue, 0);
    const totalPending = projects.reduce((sum, p) => sum + p.pendingValue, 0);
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Total Recebido: R$ ${totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY);
    doc.text(`Total a Receber: R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, finalY + 7);

    doc.save(`financeiro-projetos-${new Date().getTime()}.pdf`);
}
