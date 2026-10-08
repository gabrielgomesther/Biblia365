import React, { useState, useRef } from "react";
import { BookOpen, Trash2, ShieldAlert, Download, Upload, Database, CalendarClock } from "lucide-react";
import { exportBackup, importBackup, getLastBackupDate, isBackupRecommended } from "@/lib/backup";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PROGRESS_KEY = "chronos_biblia_cronologica_progress_v1";
const CONFIRM_WORD = "EXCLUIR";

export default function ProfileSheet() {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [lastBackup, setLastBackup] = useState(() => getLastBackupDate());
  const [backupRecommended, setBackupRecommended] = useState(() => isBackupRecommended());
  const fileInputRef = useRef(null);

  const lastBackupLabel = lastBackup
    ? `Último backup: ${new Date(lastBackup).toLocaleDateString("pt-BR")}.`
    : "Você ainda não fez nenhum backup.";

  const handleExport = () => {
    exportBackup();
    setLastBackup(new Date().toISOString());
    setBackupRecommended(false);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Restaurar um backup substituirá o progresso atual salvo neste dispositivo. Deseja continuar?")) return;
    try {
      await importBackup(file);
      window.location.reload();
    } catch (error) {
      window.alert("Não foi possível restaurar o backup: " + (error?.message || "arquivo inválido."));
    }
  };

  const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD;

  const handleDelete = () => {
    setDeleting(true);
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {
      // Se o navegador bloquear o armazenamento, a tela ainda pode ser recarregada.
    }
    window.location.reload();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir perfil e configurações"
          className="inline-flex h-11 w-11 select-none items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-[hsl(var(--accent))]"
        >
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Perfil e dados</SheetTitle>
          <SheetDescription>
            O progresso é guardado somente neste navegador. Não há conta ou sincronização em nuvem.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <p className="font-heading text-sm">Leitor neste dispositivo</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Exporte um backup antes de trocar de navegador ou aparelho. A restauração substitui o progresso atual.
            </p>
          </div>

          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="font-heading text-sm">Backup do progresso</h3>
            </div>
            {backupRecommended && (
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 p-3 text-sm">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
                <p className="text-muted-foreground">
                  Recomendamos fazer um backup agora. Faça backup do seu progresso pelo menos uma vez por mês para evitar perdas.
                </p>
              </div>
            )}
            <p className="mb-3 text-xs text-muted-foreground">{lastBackupLabel}</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar backup
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Restaurar backup
              </Button>
              <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full justify-start gap-2">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Excluir progresso deste dispositivo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
                  Excluir progresso
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3">
                    <p>Esta ação apaga permanentemente o progresso de leitura salvo neste dispositivo. Não será possível desfazer.</p>
                    <p>Para confirmar, digite <strong>{CONFIRM_WORD}</strong> no campo abaixo.</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={CONFIRM_WORD}
                autoComplete="off"
                aria-label={`Digite ${CONFIRM_WORD} para confirmar`}
                className="mt-2"
              />
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting} onClick={() => setConfirmText("")}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={!canDelete || deleting}
                  onClick={(event) => {
                    event.preventDefault();
                    if (canDelete && !deleting) handleDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Excluindo…" : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <SheetFooter className="mt-2">
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
