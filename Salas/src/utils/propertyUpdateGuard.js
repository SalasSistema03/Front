export const canSubmitPropertyUpdate = ({ loading, submitting, loadFailed = false, property }) => (
  !loading && !submitting && !loadFailed && Boolean(property)
)
