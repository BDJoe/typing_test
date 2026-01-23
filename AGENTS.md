# Agent Guidelines

This file provides build commands, testing procedures, and code style guidelines for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint            # Run ESLint
```

**Note:** This project currently does not have automated tests configured. When adding tests, use standard test frameworks like Jest, Vitest, or React Testing Library.

## Code Style Guidelines

### Imports

- Client components must start with `"use client"` directive on line 1
- Organize imports: external libraries → internal utilities → components
- Use `@/` alias for all internal imports (configured from `app/` directory)
- Import React hooks first: `import { useState, useEffect } from "react"`
- Use named exports for components and utilities
- For Zod: `import * as z from "zod"`

Example:
```tsx
"use client"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginSchema } from "@/lib/zod/login-schema"
```

### Component Patterns

- **Server Components** (default): No `"use client"` directive, can directly use server actions
- **Client Components**: Use `"use client"` directive for interactive features (hooks, event handlers)
- Use `React.ComponentProps<"div">` pattern for forwarding props:
```tsx
export function Component({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("base-class", className)} {...props} />
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm`, `StatsTable`)
- **Functions**: camelCase (e.g., `getRandomWords`, `saveResults`)
- **Variables/State**: camelCase (e.g., `isLoading`, `setLoading`)
- **Types/Interfaces**: PascalCase (e.g., `GameConfig`, `RoundResult`, `Props`)
- **Constants**: PascalCase (e.g., `LoginSchema`, `buttonVariants`)

### Type Safety

- Use TypeScript strict mode (already configured)
- Define Props interfaces for all components:
```tsx
interface Props {
  config: GameConfig
  handleSettingChange: (setting: string, value: string) => void
}
```

- Infer types from Zod schemas:
```tsx
const form = useForm<z.infer<typeof LoginSchema>>({
  resolver: zodResolver(LoginSchema),
  defaultValues: { email: "", password: "" }
})
```

- Use generic types for reusable components (e.g., `ColumnDef<TData, TValue>`)

### Form Handling

- Use `react-hook-form` with `zodResolver`
- Use `Controller` for complex inputs:
```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...field} id="email" aria-invalid={fieldState.invalid} />
    </Field>
  )}
/>
```

### Server Actions

- Server actions must be in `.tsx` files with `"use server"` directive
- Use for database operations (Prisma) and file I/O
- Example:
```tsx
"use server"
import prisma from "@/lib/prisma"

export async function saveSettings(userId: string, settings: GameConfig) {
  await prisma.gameSettings.upsert({
    where: { userId },
    update: { mode: settings.gameMode },
    create: { userId, mode: settings.gameMode }
  })
}
```

### Styling

- Use Tailwind CSS with the `cn()` utility for class merging
- Apply responsive prefixes (e.g., `max-md:text-[2rem]`)
- Use Radix UI primitives via shadcn/ui components
- Common patterns:
  - `className="flex items-center gap-4"`
  - `className="transition-all duration-300 ease-in-out"`
  - `className="hover:bg-accent hover:text-accent-foreground"`

### Error Handling

- Use try/catch for async operations
- Show user-facing errors with toast notifications:
```tsx
if (res.error) {
  toast.error(res.error.message || "Something went wrong", {
    duration: 4000,
    style: { color: "red" }
  })
}
```
- Use `console.error()` for debugging only

### State Management

- Use React hooks: `useState`, `useEffect`, `useRef`
- Session management via `better-auth`: `const { data: session } = useSession()`
- Timer functionality via `react-timer-hook`: `useStopwatch()`
- Loading states should use generic `isLoading` pattern

### File Organization

```
app/
├── (auth)/           # Protected routes (dashboard, profile, etc.)
├── (home)/           # Public routes
├── api/              # API routes (Next.js Route Handlers)
├── components/       # Reusable components
│   ├── ui/          # shadcn/ui components
│   └── buttons/     # Specialized button components
├── lib/             # Utilities and configurations
│   ├── auth.ts      # Auth server configuration
│   ├── auth-client.ts # Auth client hooks
│   ├── prisma.ts    # Prisma client singleton
│   ├── server/      # Server actions
│   ├── types/       # TypeScript type definitions
│   ├── zod/         # Zod validation schemas
│   └── utils.ts     # cn() utility
├── globals.css      # Global styles
└── layout.tsx       # Root layout
```

### Database (Prisma)

- Use Prisma client from `@/lib/prisma`
- Schema defined in `prisma/schema.prisma`
- Use `upsert()` for settings (create or update)
- Always use proper cascade deletes in schema relations
- Types are auto-generated to `app/generated/prisma`

### Best Practices

- Keep component files focused - break large components into smaller sub-components
- Extract reusable logic into custom hooks if needed
- Use TypeScript for all new code - no `any` types
- Prefer named exports over default exports for better tree-shaking
- Use semantic HTML elements (e.g., `<button>`, `<input>`, `<label>`)
- Add `aria-invalid` attributes for form validation feedback
- Use FontAwesome icons via `@fortawesome/react-fontawesome`
- Enable auto CSS config for FontAwesome: `config.autoAddCss = false`

### Linting

- ESLint is configured with `eslint-config-next`
- Run `npm run lint` before committing changes
- Fix linting errors automatically where possible

### Notes

- Next.js 16.1.0 with App Router
- React 19.2.3
- PostgreSQL database with Prisma
- Authentication via better-auth
- Styling: Tailwind CSS v4 + shadcn/ui
- Icons: FontAwesome
- Forms: react-hook-form + Zod validation
- Charts: Recharts + @tanstack/react-table
