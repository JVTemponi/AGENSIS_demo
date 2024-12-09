import React from 'react'
import { useState } from 'react'
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { useTransacoes } from '@/hooks/useTransacoes'

const API_URL = 'http://localhost:3002/api'

interface Transacao {
  id: number
  nome: string
  tipo: string
  valor: number
  data: string
  status: string
}

export function TransacoesTable() {
  const { transacoes, loading, buscarTransacoes } = useTransacoes()
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [atualizandoStatus, setAtualizandoStatus] = React.useState(false)
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null)

  const atualizarStatusTransacao = async (id: number, novoStatus: string) => {
    if (atualizandoId === id) return // Impede atualizações simultâneas para a mesma transação

    const getToken = () => sessionStorage.getItem("authorization");

    try {
      // Salva a posição atual do scroll antes de recarregar a página
      const scrollY = window.scrollY;
      sessionStorage.setItem('scrollPosition', scrollY.toString());

      setAtualizandoId(id);
      setAtualizandoStatus(true);

      const token = getToken();

      const response = await axios.put(`${API_URL}/transacoes/${id}`,
        {
          status: novoStatus
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });

      if (response.status === 200) {
        console.log('Status atualizado com sucesso:', response.data);
        toast({
          title: 'Status atualizado',
          description: 'A transação foi atualizada com sucesso.',
          duration: 3000
        });

        // Atualiza os dados das transações
        await buscarTransacoes();

        // Recarrega a página
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da transação.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setAtualizandoStatus(false);
      setAtualizandoId(null);
    }
  };

  // Após o recarregamento da página, restaura a posição do scroll
  window.addEventListener('load', () => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      sessionStorage.removeItem('scrollPosition'); // Limpa a posição salva após o uso
    }
  });


  const columns: ColumnDef<Transacao>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          id="select-all"
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onChange={() => table.toggleAllPageRowsSelected()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          id={`select-row-${row.id}`}
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => <div className="font-medium">{row.getValue('nome')}</div>,
      filterFn: (row, id, value) => {
        const nome = (row.getValue('nome') as string).toLowerCase()
        return nome.includes(value.toLowerCase())
      }
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <div
          className={`capitalize font-medium ${row.getValue('tipo') === 'entrada' ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {row.getValue('tipo')}
        </div>
      )
    },
    {
      accessorKey: 'valor',
      header: () => <div className="text-right">Valor</div>,
      cell: ({ row }) => {
        const valor = parseFloat(row.getValue('valor'))
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valor)

        return <div className="text-right font-medium">{formatted}</div>
      }
    },
    {
      accessorKey: 'data',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const data = new Date(row.getValue('data'))
        return <div>{data.toLocaleDateString('pt-BR')}</div>
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <div
            className={`capitalize font-medium ${status === 'concluido'
                ? 'text-green-600'
                : status === 'pendente'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
          >
            {status}
          </div>
        )
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id.toString())}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              {transaction.status === 'pendente' && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Concluir transação
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Concluir transação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja marcar esta transação como concluída?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => atualizarStatusTransacao(transaction.id, 'concluido')}
                          disabled={atualizandoStatus || atualizandoId === transaction.id}
                        >
                          {atualizandoId === transaction.id ? 'Atualizando...' : 'Confirmar'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600"
                      >
                        Cancelar transação
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar transação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja cancelar esta transação?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => atualizarStatusTransacao(transaction.id, 'cancelado')}
                          disabled={atualizandoStatus || atualizandoId === transaction.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {atualizandoId === transaction.id ? 'Cancelando...' : 'Confirmar cancelamento'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data: transacoes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TransacoesTable