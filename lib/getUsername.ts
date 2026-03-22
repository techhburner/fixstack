export function getUsername(email: string) {
  if (!email) return "User"

  const namePart = email.split("@")[0] // prakash.burra

  return namePart
    .split(".")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}