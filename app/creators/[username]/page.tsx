import { CreatorProfilePage } from "@/features/creators/creator-profile-page";

export default async function CreatorPage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <CreatorProfilePage username={username} />;
}
