import { useSearchParams } from "react-router-dom"

export const SEARCH_PARAM_KEYS = {
    PAGE: 'page',
    QUERY: 'query',
    SELECTED: 'selected',
}

export const useSearchParamsWrapper = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const setSearchParamValue = (key: string, value: string) => {
    setSearchParams(searchParams => {
      searchParams.set(key, value)
      return searchParams
    })
  }
  return { searchParams, setSearchParamValue}
}