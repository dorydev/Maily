import { useState } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../components/ui/toggle-group";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

import fontIcon from "../assets/icons8-font-90.svg";
import fileIcon from "../assets/icons8-add-file-100.svg";
import linkIcon from "../assets/icons8-add-link-100.svg";

type MaskIconProps = {
  src: string;
  className?: string;
};

function MaskIcon({ src, className }: MaskIconProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}



function Home() {
  const [temperature, setTemperature] = useState<number[]>([0.56]);
  const [maxLength, setMaxLength] = useState<number[]>([256]);
  const [topP, setTopP] = useState<number[]>([0.9]);

  const [composeMode, setComposeMode] = useState<"manual" | "upload">("manual");
  const [sidebarDraft, setSidebarDraft] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [rateLimit, setRateLimit] = useState<number>(1.0);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [apiSendRoute, setApiSendRoute] = useState("");
  const [variables, setVariables] = useState<{ key: string; label: string }[]>([
    { key: "$prenom", label: "Prenom" },
  ]);
  const [signatures, setSignatures] = useState<File[]>([]);

  const addVariable = () =>
    setVariables((v) => [...v, { key: "", label: "" }]);

  const updateVariable = (i: number, field: "key" | "label", value: string) =>
    setVariables((v) =>
      v.map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      )
    );

  const removeVariable = (i: number) =>
    setVariables((v) => v.filter((_, idx) => idx !== i));

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setSignatures((prev) => [...prev, ...files]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFileAt = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 p-6">
        {/* Left: prompt area */}
        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground font-bold text-xl">
              New Mail :
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <Input
              placeholder="Object"
              className="h-9 text-sm"
            />

            <Textarea
              className="flex-1 min-h-[320px] resize-none border-0 bg-background px-0 py-0 text-sm"
              placeholder="Write your mail here ..."
            />

            {/* Actions (moved inside the editor card) */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Button size="sm" variant="outline">
                ⟲
              </Button>
               {/* Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon">
                        <MaskIcon src={fontIcon} className="h-5 w-5" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon">
                        <MaskIcon src={fileIcon} className="h-5 w-5" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon">
                        <MaskIcon src={linkIcon} className="h-5 w-5" />
                      </Button>
                    </div>

                    <Button type="button" size="sm" variant="outline">
                      Insert
                    </Button>
                  </div>

              <Button size="sm">Submit</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: controls */}
        <Card className="flex w-[280px] flex-col">
          <CardContent className="flex flex-1 flex-col gap-6 pt-6">
            {/* Mode */}
            <section className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Mode
              </Label>
              <ToggleGroup
                type="single"
                defaultValue="complete"
                className="grid grid-cols-3"
              >
                <ToggleGroupItem
                  value="complete"
                  className="py-1 text-xs"
                  aria-label="Complete"
                >
                  ↦
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="insert"
                  className="py-1 text-xs"
                  aria-label="Insert"
                >
                  ⌄
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="edit"
                  className="py-1 text-xs"
                  aria-label="Edit"
                >
                  ✎
                </ToggleGroupItem>
              </ToggleGroup>
            </section>

            {/* Model */}
            <section className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Model
              </Label>
              <Select defaultValue="text-davinci-003">
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">mail-model-3</SelectItem>
                  <SelectItem value="gpt-4o">mail-model-2</SelectItem>
                  <SelectItem value="text-davinci-003">
                    mail-model-1
                  </SelectItem>
                </SelectContent>
              </Select>
            </section>

            {/* Temperature */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Temperature</span>
                <span>{temperature[0].toFixed(2)}</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onValueChange={setTemperature}
              />
            </section>

            {/* Maximum length */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Maximum Length</span>
                <span>{maxLength[0]}</span>
              </div>
              <Slider
                min={1}
                max={2048}
                step={1}
                value={maxLength}
                onValueChange={setMaxLength}
              />
            </section>

            {/* Top P */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Top P</span>
                <span>{topP[0].toFixed(2)}</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={topP}
                onValueChange={setTopP}
              />
            </section>

            {/* Compose (manual vs upload) */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Compose
                </Label>

                <ToggleGroup
                  type="single"
                  value={composeMode}
                  onValueChange={(v) =>
                    v === "manual" || v === "upload" ? setComposeMode(v) : null
                  }
                  className="grid grid-cols-2"
                >
                  <ToggleGroupItem value="manual" className="py-1 text-xs">
                    Manual
                  </ToggleGroupItem>
                  <ToggleGroupItem value="upload" className="py-1 text-xs">
                    Upload
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {composeMode === "manual" ? (
                <div className="space-y-2">
                  <Textarea
                    value={sidebarDraft}
                    onChange={(e) => setSidebarDraft(e.target.value)}
                    placeholder="Write here…"
                    className="min-h-[140px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use this box for snippets you want to insert into your mail.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Upload attachments
                    </Label>

                    <Button asChild size="sm" variant="outline">
                      <label className="cursor-pointer">
                        Choose files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </Button>
                  </div>

                  {uploadedFiles.length === 0 ? (
                    <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                      No files selected.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="rounded-md border border-border p-3">
                        <ul className="space-y-2">
                          {uploadedFiles.map((f, idx) => (
                            <li
                              key={`${f.name}-${f.size}-${idx}`}
                              className="flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="truncate">
                                {f.name}{" "}
                                <span className="text-muted-foreground">
                                  ({Math.round(f.size / 1024)} KB)
                                </span>
                              </span>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFileAt(idx)}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button type="button" size="sm" className="w-full">
                        Attach to mail
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </section>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[420px] space-y-4">

                {/* VARIABLES */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Variables
                  </Label>

                  {variables.map((v, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <Input
                        className="h-8"
                        placeholder="$prenom"
                        value={v.key}
                        onChange={(e) => updateVariable(i, "key", e.target.value)}
                      />
                      <Input
                        className="h-8"
                        placeholder="Prenom"
                        value={v.label}
                        onChange={(e) => updateVariable(i, "label", e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariable(i)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  <Button size="sm" variant="outline" onClick={addVariable}>
                    + Add variable
                  </Button>
                </section>

                {/* RATE LIMIT */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Rate limit
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(parseFloat(e.target.value))}
                    className="h-8"
                    placeholder="Seconds between mails"
                  />
                </section>

                {/* API */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    API
                  </Label>
                  <Input
                    className="h-8"
                    placeholder="Base URL (https://api.example.com)"
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                  />
                  <Input
                    className="h-8"
                    placeholder="Send route (/mail/send)"
                    value={apiSendRoute}
                    onChange={(e) => setApiSendRoute(e.target.value)}
                  />
                </section>

                {/* SIGNATURES */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Signatures
                  </Label>

                  <Button asChild size="sm" variant="outline">
                    <label className="cursor-pointer">
                      Upload signatures
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleSignatureUpload}
                      />
                    </label>
                  </Button>

                  {signatures.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {signatures.map((f, i) => (
                        <li key={i}>{f.name}</li>
                      ))}
                    </ul>
                  )}
                </section>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Home;
