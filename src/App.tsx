import { useAuth } from './hooks/useAuth';
import { useDecider } from './hooks/useDecider';
import AppHeader from './components/AppHeader';
import AuthGate from './components/AuthGate';
import CategoryTabs from './components/CategoryTabs';
import AddItemForm from './components/AddItemForm';
import ItemList from './components/ItemList';
import PickButton from './components/PickButton';
import PickModal from './components/PickModal';
import Toast from './components/Toast';

export default function App() {
  const { user, loading } = useAuth();
  const {
    ready, items, cat, sort, toast, pickedItem, loadingIds,
    categories, data,
    setCat, setSort, markItem, deleteItem, addItem, pickOne, giveFeedback, closeModal, reroll,
    addCategory, deleteCategory,
  } = useDecider(user?.uid ?? null);

  const activeCat = categories.find(c => c.id === cat) ?? categories[0];
  const [categoryEmoji, ...rest] = activeCat.label.split(' ');
  const categoryLabel = rest.join(' ');

  return (
    <AuthGate user={user} loading={loading}>
      <div className="app">
        <AppHeader user={user} />
        {!ready ? (
          <div className="loading-screen">Loading your lists…</div>
        ) : (
          <>
            <CategoryTabs
              categories={categories}
              active={cat}
              data={data}
              onSelect={setCat}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
            />
            <AddItemForm placeholder={activeCat.placeholder} hint={activeCat.hint} onAdd={addItem} />
            <ItemList
              items={items}
              sort={sort}
              loadingIds={loadingIds}
              categoryEmoji={categoryEmoji}
              onSort={setSort}
              onMark={markItem}
              onDelete={deleteItem}
            />
            <PickButton onClick={pickOne} />
            <PickModal
              item={pickedItem}
              categoryLabel={categoryLabel}
              onFeedback={giveFeedback}
              onClose={closeModal}
              onReroll={reroll}
            />
          </>
        )}
        <Toast message={toast} />
      </div>
    </AuthGate>
  );
}
