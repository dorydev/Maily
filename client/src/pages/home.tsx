import { WorkspaceShell } from "../components/workspace-shell"

function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <main className="flex w-full min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 min-w-0 items-center gap-3 border-b bg-background px-6 py-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight">Maily</div>
            <div className="truncate text-xs text-muted-foreground leading-tight">Bulk Sender</div>
          </div>


          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
              JD
            </button>
          </div>
        </div>

          <div className="flex min-h-0 flex-1 min-w-0 gap-4 overflow-hidden p-6">
            <ComposeEmailCard
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              format={format}
              setFormat={setFormat}
              variables={variables}
              insertAtCursor={insertAtCursor}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              recipientsPreviewEmail={recipients[0]?.email}
              isSending={isSending}
              recipientsCount={recipients.length}
              handleSend={handleSend}
              handleStopSending={handleStopSending}
              sendError={sendError}
              bodyRef={bodyRef}
            />
            <CampaignSettingsCard
              recipientsText={recipientsText}
              setRecipientsText={setRecipientsText}
              recipientsCount={recipients.length}
              applyRecipientsFromText={applyRecipientsFromText}
              handleRecipientsFileUpload={handleRecipientsFileUpload}
              format={format}
              variablesCount={variables.length}
              rateLimit={rateLimit}
              sentCount={sentCount}
              signatures={signatures}
              handleSignatureUpload={handleSignatureUpload}
              addVariable={addVariable}
              updateVariable={updateVariable}
              removeVariable={removeVariable}
              variables={variables}
              apiBaseUrl={apiBaseUrl}
              setApiBaseUrl={setApiBaseUrl}
              apiSendRoute={apiSendRoute}
              setApiSendRoute={setApiSendRoute}
              sendUrl={sendUrl}
              setRateLimit={setRateLimit}
            />
          </div>
        </main>
    </div>
  )
}

export default Home
