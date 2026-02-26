import { useState } from "react";
import { AppSidebar } from "../components/app-sidebar";
import { Topbar } from "../components/topbar";

function Test() {
  const [crashNow, setCrashNow] = useState(false);

  // This simulates a render-time crash, which will be caught by ErrorBoundary
  if (crashNow) {
    throw new Error("Test crash: render error from /test");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Topbar/>
      <div className="flex min-h-0 flex-1">

      <AppSidebar/>

    <div className="min-w-0 flex-1 p-6">
      <h1 className="text-xl font-semibold">Error Handling test-page</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the buttons below to intentionally crash this route and verify the global ErrorBoundary.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => setCrashNow(true)}
        >
          Crash during render (caught)
        </button>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Test;
