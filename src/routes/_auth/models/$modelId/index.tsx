import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/models/$modelId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/models/$modelId/"!</div>
}
