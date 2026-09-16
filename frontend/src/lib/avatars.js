export const avatarUrl = (seed, size = 150) =>
  seed == null ? '' : `https://i.pravatar.cc/${size}?img=${(Math.abs(Number(seed)) % 70) + 1}`

export const randomAvatar = (size = 150) =>
  `https://i.pravatar.cc/${size}?img=${Math.floor(Math.random() * 70) + 1}`