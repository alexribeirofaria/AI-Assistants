from presentation.interfaces.i_output_formatter import IOutputFormatter

class OutputFormatter(IOutputFormatter):
    def format_help(self) -> str:
        return "Digite: claude | openai | gemini | groq | list models | cls -> limpar tela | exit\n"

    def format_welcome(self) -> str:
        return "Welcome to your AI Assistant"

    def format_model_switched(self, prompt: str) -> str:
        return f"\nSwitched to {prompt}"

    def format_interpreted_input(self, raw: str, interpreted: str) -> str:
        return f"[info] Interpretei '{raw}' como '{interpreted}'."

    def format_response(self, domain_name: str, response: str) -> str:
        return f"\n[{domain_name}]: {response}\n"

    def format_loading_models(self) -> str:
        return "\n[info] Buscando modelos...\n"

    def format_elapsed_time(self, minutes: int, seconds: int) -> str:
        return f"[info] Tempo decorrido: {minutes:02d}:{seconds:02d}"

    def format_model_list(self, header: str, names: list[str], prefix: str = "- ") -> str:
        lines = [header]
        lines.extend(f"{prefix}{name}" if prefix else name for name in names)
        return "\n".join(lines)

    def format_warning(self, message: str) -> str:
        return f"\n[warn] {message}\n"

    def format_error(self, message: str) -> str:
        return f"[ERROR] {message}"

    def format_goodbye(self) -> str:
        return "AI Assistant: Goodbye!"
