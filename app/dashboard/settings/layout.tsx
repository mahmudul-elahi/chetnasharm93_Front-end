import ProfileCard from "./_components/ProfileCard";


// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;


export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left - Static Profile Card */}
        <div className="lg:col-span-4">
          <div className="sticky">
            <ProfileCard />
          </div>
        </div>

        {/* Right - Dynamic Settings */}
        <div className="lg:col-span-8">
          {children}
        </div>
      </div>
    </div>
  );
}