const Dashboard = () => {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 z-0 backdrop-blur-2xl">
        <div className="background h-full w-full opacity-60">
          <div className="px-4 lg:px-6" />
        </div>
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-black/30 p-6 text-center text-3xl font-bold text-white shadow-lg backdrop-blur-sm">
          Dashboard kommt bald
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
