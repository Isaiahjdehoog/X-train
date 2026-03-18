export default function SyncStatus({ status }) {
  return (
    <div className="sync-status sans" style={{ opacity: status ? 1 : 0 }}>
      {status}
    </div>
  );
}
