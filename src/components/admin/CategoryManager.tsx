import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Input,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Select,
  Option,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { addCategory, renameCategory, deleteCategory, deleteCategoryEmpty } from '../../firebase/admin';
import { clearFirestoreCache } from '../../firebase/firestore';

interface CategoryManagerProps {
  products: any[];
  categories: string[];
  onCategoriesChanged: () => void;
}

export default function CategoryManager({
  products,
  categories,
  onCategoriesChanged,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Rename state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete/reassign state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [reassignTo, setReassignTo] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const getCategoryStats = (category: string) => {
    const cat = products.filter((p) => p.category === category);
    return {
      count: cat.length,
      totalStock: cat.reduce((sum, p) => sum + (p.stock || 0), 0),
    };
  };

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    setAddLoading(true);
    setAddError('');
    try {
      await addCategory(newCategory.trim());
      setNewCategory('');
      onCategoriesChanged();
    } catch (e: any) {
      setAddError(e.message || 'Erro ao adicionar categoria');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Rename ─────────────────────────────────────────────────────────────────
  const startEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
    setEditError('');
  };

  const handleRename = async () => {
    if (!editingCategory) return;
    const trimmed = editValue.trim();
    if (!trimmed) { setEditError('Nome inválido'); return; }
    if (trimmed === editingCategory) { cancelEdit(); return; }
    if (
      categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase()) &&
      trimmed.toLowerCase() !== editingCategory.toLowerCase()
    ) {
      setEditError('Já existe uma categoria com esse nome');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      await renameCategory(editingCategory, trimmed);
      clearFirestoreCache();
      onCategoriesChanged();
      cancelEdit();
    } catch (e: any) {
      setEditError(e.message || 'Erro ao renomear');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const openDelete = (cat: string) => {
    setDeleteTarget(cat);
    setReassignTo('');
    setDeleteError('');
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setReassignTo('');
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const stats = getCategoryStats(deleteTarget);
    setDeleteLoading(true);
    setDeleteError('');
    try {
      if (stats.count > 0) {
        if (!reassignTo) {
          setDeleteError('Selecione uma categoria para os produtos');
          setDeleteLoading(false);
          return;
        }
        await deleteCategory(deleteTarget, reassignTo);
      } else {
        await deleteCategoryEmpty(deleteTarget);
      }
      clearFirestoreCache();
      onCategoriesChanged();
      closeDelete();
    } catch (e: any) {
      setDeleteError(e.message || 'Erro ao deletar');
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteModalStats = deleteTarget ? getCategoryStats(deleteTarget) : null;
  const reassignOptions = deleteTarget ? categories.filter(c => c !== deleteTarget) : [];

  return (
    <Box>
      <Typography level="h4" sx={{ mb: 3 }}>
        Gerenciar Categorias
      </Typography>

      {/* Add New Category */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="title-md" sx={{ mb: 2 }}>
            Nova Categoria
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Input
              placeholder="Nome da categoria..."
              value={newCategory}
              onChange={(e) => { setNewCategory(e.target.value); setAddError(''); }}
              sx={{ flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              error={!!addError}
            />
            <Button
              startDecorator={addLoading ? <CircularProgress size="sm" /> : <AddIcon />}
              onClick={handleAdd}
              loading={addLoading}
            >
              Adicionar
            </Button>
          </Box>
          {addError && (
            <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
              {addError}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Categorias Existentes ({categories.length})
      </Typography>

      {categories.length === 0 ? (
        <Card variant="soft">
          <CardContent>
            <Typography sx={{ textAlign: 'center' }}>
              Nenhuma categoria ainda. Adicione uma nova categoria acima.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const isEditing = editingCategory === category;
            return (
              <Card key={category} variant="outlined">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {isEditing ? (
                    <Box sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Input
                        value={editValue}
                        onChange={(e) => { setEditValue(e.target.value); setEditError(''); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        sx={{ flex: 1, minWidth: 150 }}
                        error={!!editError}
                      />
                      {editError && (
                        <Typography level="body-xs" color="danger">{editError}</Typography>
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Typography level="title-lg">{category}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip size="sm" color="primary">
                          {stats.count} produto{stats.count !== 1 ? 's' : ''}
                        </Chip>
                        <Chip size="sm" color="success">
                          {stats.totalStock} em estoque
                        </Chip>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    {isEditing ? (
                      <>
                        <IconButton
                          size="sm"
                          variant="solid"
                          color="primary"
                          onClick={handleRename}
                          loading={editLoading}
                          title="Salvar"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton size="sm" variant="soft" onClick={cancelEdit} title="Cancelar">
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="sm"
                          variant="soft"
                          onClick={() => startEdit(category)}
                          title="Renomear categoria"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="danger"
                          onClick={() => openDelete(category)}
                          title="Deletar categoria"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Delete / Reassign Modal */}
      <Modal open={!!deleteTarget} onClose={closeDelete}>
        <ModalDialog sx={{ minWidth: { xs: '90vw', sm: 420 } }}>
          <ModalClose />
          <Typography level="h4" startDecorator={<WarningAmberIcon color="warning" />}>
            Deletar Categoria
          </Typography>
          <Divider />

          {deleteTarget && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {deleteModalStats && deleteModalStats.count > 0 ? (
                <>
                  <Alert color="warning" variant="soft">
                    A categoria <strong>"{deleteTarget}"</strong> possui{' '}
                    <strong>
                      {deleteModalStats.count} produto{deleteModalStats.count !== 1 ? 's' : ''}
                    </strong>.{' '}
                    Selecione para onde os produtos serão movidos:
                  </Alert>

                  <Select
                    placeholder="Selecione a categoria de destino..."
                    value={reassignTo || null}
                    onChange={(_, v) => { setReassignTo(v as string); setDeleteError(''); }}
                  >
                    {reassignOptions.map((c) => (
                      <Option key={c} value={c}>{c}</Option>
                    ))}
                  </Select>

                  {deleteError && (
                    <Typography level="body-sm" color="danger">{deleteError}</Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button variant="plain" onClick={closeDelete}>Cancelar</Button>
                    <Button
                      color="danger"
                      loading={deleteLoading}
                      onClick={handleDelete}
                      disabled={!reassignTo}
                    >
                      Mover e Deletar
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography>
                    Tem certeza que deseja deletar a categoria{' '}
                    <strong>"{deleteTarget}"</strong>? Ela não possui produtos.
                  </Typography>

                  {deleteError && (
                    <Typography level="body-sm" color="danger">{deleteError}</Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button variant="plain" onClick={closeDelete}>Cancelar</Button>
                    <Button color="danger" loading={deleteLoading} onClick={handleDelete}>
                      Deletar
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </Box>
  );
}