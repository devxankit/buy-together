// Buy Together — App Design Canvas
// Assembles all screens into a single panable / zoomable design canvas

const App = () => {
  const { ScreenOnboarding, ScreenLogin, ScreenOTP, ScreenLocation } = window.AuthScreens;
  const { ScreenHome, ScreenSidebar, ScreenCategory, ScreenNotifications } = window.HomeScreens;
  const { ScreenGroupDetail, ScreenGroupChat, ScreenCreateGroup } = window.GroupScreens;
  const { ScreenVendorDashboard, ScreenVendorOffer } = window.VendorScreens;
  const { ScreenProfile, ScreenMyGroups, ScreenDealConfirm } = window.MiscScreens;

  // Standard iPhone artboard size
  const W = PHONE_W + 20;   // gutter
  const H = PHONE_H + 60;   // header room

  return (
    <DesignCanvas>
      {/* ── System overview ── */}
      <DCSection id="00-system" title="00 · Design System"
        subtitle="Brand foundation — color, type, components, principles">
        <DCArtboard id="ds-overview" label="Foundation overview" width={1700} height={1240}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <DesignSystem />
          </div>
        </DCArtboard>
      </DCSection>

      {/* ── Auth flow ── */}
      <DCSection id="01-auth" title="01 · Onboarding & Authentication"
        subtitle="First-time experience — feels warm, social and trustworthy">
        <DCArtboard id="auth-onboarding" label="Onboarding · Hero" width={W} height={H}>
          <ScreenOnboarding />
        </DCArtboard>
        <DCArtboard id="auth-login" label="Sign-in (Buyer / Vendor)" width={W} height={H}>
          <ScreenLogin />
        </DCArtboard>
        <DCArtboard id="auth-otp" label="OTP verification" width={W} height={H}>
          <ScreenOTP />
        </DCArtboard>
        <DCArtboard id="auth-location" label="Location permission" width={W} height={H}>
          <ScreenLocation />
        </DCArtboard>
      </DCSection>

      {/* ── Home & discovery ── */}
      <DCSection id="02-home" title="02 · Home & Discovery"
        subtitle="Banner carousel, search, categories, trending, live activity, sidebar">
        <DCArtboard id="home-main" label="Home · Logged in" width={W} height={H}>
          <ScreenHome />
        </DCArtboard>
        <DCArtboard id="home-sidebar" label="Sidebar drawer" width={W} height={H}>
          <ScreenSidebar />
        </DCArtboard>
        <DCArtboard id="home-category" label="Category · Phones" width={W} height={H}>
          <ScreenCategory />
        </DCArtboard>
        <DCArtboard id="home-notif" label="Notifications" width={W} height={H}>
          <ScreenNotifications />
        </DCArtboard>
      </DCSection>

      {/* ── Group flow ── */}
      <DCSection id="03-group" title="03 · Group Flow"
        subtitle="Detail · chat · poll · create — every screen surfaces buying momentum">
        <DCArtboard id="group-detail" label="Group detail" width={W} height={H}>
          <ScreenGroupDetail />
        </DCArtboard>
        <DCArtboard id="group-chat" label="Group chat · with poll" width={W} height={H}>
          <ScreenGroupChat />
        </DCArtboard>
        <DCArtboard id="group-create" label="Create group · step 2" width={W} height={H}>
          <ScreenCreateGroup />
        </DCArtboard>
      </DCSection>

      {/* ── Vendor ── */}
      <DCSection id="04-vendor" title="04 · Vendor Surface"
        subtitle="A separate role with its own dashboard, demand intelligence and offer builder">
        <DCArtboard id="vendor-dash" label="Vendor dashboard" width={W} height={H}>
          <ScreenVendorDashboard />
        </DCArtboard>
        <DCArtboard id="vendor-offer" label="Create offer" width={W} height={H}>
          <ScreenVendorOffer />
        </DCArtboard>
      </DCSection>

      {/* ── Profile & deals ── */}
      <DCSection id="05-profile" title="05 · Profile, My Groups & Deal Confirmation"
        subtitle="The user's own story — savings, badges, active groups, deal close">
        <DCArtboard id="profile" label="Profile · gamified" width={W} height={H}>
          <ScreenProfile />
        </DCArtboard>
        <DCArtboard id="my-groups" label="My groups" width={W} height={H}>
          <ScreenMyGroups />
        </DCArtboard>
        <DCArtboard id="deal-confirm" label="Deal locked · confirm" width={W} height={H}>
          <ScreenDealConfirm />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
