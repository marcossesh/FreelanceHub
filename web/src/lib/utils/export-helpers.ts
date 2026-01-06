export function sanitizeDataForExport(data: any[]) {
  return data.map(item => {
    const sanitized = { ...item };

    if (sanitized.client?.email) {
      sanitized.clientEmail = sanitized.client.email.replace(
        /(.{2})(.*)(@.*)/,
        "$1***$3"
      );
    }

    delete sanitized.id;
    delete sanitized.userId;
    delete sanitized.clientId;
    delete sanitized.client;
    
    return sanitized;
  });
}
