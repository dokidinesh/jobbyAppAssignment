import './index.css'

const FiltersGroup = props => {
  const renderSalaryRangesFiltersList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salaryRange => {
      const {changeSalaryRange, activeSalaryRangeId} = props
      const onClickSalaryRange = () =>
        changeSalaryRange(salaryRange.salaryRangeId)
      return (
        <li key={salaryRange.salaryRangeId} className="list-item">
          <input
            className="filter-input"
            type="radio"
            id={salaryRange.salaryRangeId}
            name="salary range"
            onClick={onClickSalaryRange}
          />
          <label htmlFor={salaryRange.salaryRangeId}>{salaryRange.label}</label>
        </li>
      )
    })
  }

  const renderSalaryRangeFilters = () => (
    <div>
      <h1 className="heading">Salary Range</h1>
      <ul className="list-container">{renderSalaryRangesFiltersList()}</ul>
    </div>
  )

  const renderEmploymentTypesFiltersList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(employmentType => {
      const {changeEmploymentType, activeEmploymentTypeId} = props

      const onClickEmploymentType = () =>
        changeEmploymentType(employmentType.employmentTypeId)

      return (
        <li key={employmentType.employmentTypeId} className="list-item">
          <input
            className="filter-input"
            type="checkbox"
            id={employmentType.employmentTypeId}
            onClick={onClickEmploymentType}
          />
          <label htmlFor={employmentType.employmentTypeId}>
            {employmentType.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypesFilters = () => (
    <div>
      <h1 className="heading">Type of Employment</h1>
      <ul className="list-container">{renderEmploymentTypesFiltersList()}</ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      {renderSalaryRangeFilters()}

      <hr className="separator" />

      {renderEmploymentTypesFilters()}
    </div>
  )
}

export default FiltersGroup
