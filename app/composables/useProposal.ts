// composables digunain buat set state
export const useProposal = () => {
  const proposals = ref([])

  const getAllProposals = async () => {
    return proposals.value
  }

  return {
    proposals,
    getAllProposals,
  }
}