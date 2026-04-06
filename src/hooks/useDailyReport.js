import { useState, useEffect } from 'react'
import { dailyReportApi } from '../api/api'

export function useDailyReport(date) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const response = await dailyReportApi.getByDate(date)
        setReport(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [date])

  const saveReport = async (reportData) => {
    try {
      setLoading(true)
      const response = await dailyReportApi.create(reportData)
      setReport(response.data)
      setError(null)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { report, loading, error, saveReport }
}
