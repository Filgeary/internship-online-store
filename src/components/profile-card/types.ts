import type { TranslateFn } from "@src/i18n/types"
import type { ProfileData } from "@src/types"

export type ProfileCardProps = {
  data: Partial<Pick<ProfileData, 'email' | 'profile'>>,
  t: TranslateFn
}