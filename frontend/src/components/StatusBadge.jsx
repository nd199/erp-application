function StatusBadge({ status }) {
    const styles = {
        ACTIVE: 'bg-green-500/15 border-green-500/30 text-green-400',
        INACTIVE: 'bg-gray-500/15 border-gray-500/30 text-gray-400',
        PENDING: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
        LOCKED: 'bg-red-500/15 border-red-500/30 text-red-400',
    }

    const style = styles[status] || styles.ACTIVE

    return (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${style}`}>
            {status}
        </span>
    )
}

export default StatusBadge
