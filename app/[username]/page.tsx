import { redirect } from 'next/navigation'

interface Props {
  params: { username: string }
}

export default function UsernameRootRedirect({ params }: Props) {
  redirect(`/ar/${params.username.trim()}`)
}