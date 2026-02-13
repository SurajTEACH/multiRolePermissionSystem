export default function Can({ permission, user, children, fallback = null }) {
  const perms = user?.permissions || [];
  if (!permission) return children;
  return perms.includes(permission) ? children : fallback;
}
