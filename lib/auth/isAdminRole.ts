export function isAdminRole(role: string | null | undefined): boolean {
  return String(role ?? '').trim().toLowerCase() === 'admin';
}
