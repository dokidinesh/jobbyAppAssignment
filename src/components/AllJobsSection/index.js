import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import JobCard from '../JobCard'
import FiltersGroup from '../FiltersGroup'
import ProfileSection from '../ProfileSection'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class AllJobsSection extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    searchInputValue: '',
    activeEmploymentTypesList: [],
    activeSalaryRangeId: salaryRangesList[0].salaryRangeId,
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeEmploymentTypesList,
      activeSalaryRangeId,
      searchInputValue,
    } = this.state

    console.log(activeEmploymentTypesList)

    const updatedActiveEmploymentTypeId = activeEmploymentTypesList.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${updatedActiveEmploymentTypeId}&minimum_package=${activeSalaryRangeId}&search=${searchInputValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        jobDescription: job.job_description,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobsList()
  }

  onEnterSearchInput = () => {
    this.getJobsList()
  }

  onChangeSearchInput = event => {
    this.setState({searchInputValue: event.target.value})
  }

  changeSalaryRange = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobsList)
  }

  changeEmploymentType = employmentTypeId => {
    this.setState(prevState => {
      const updatedActiveEmploymentTypesList = [
        ...prevState.activeEmploymentTypesList,
        employmentTypeId,
      ]
      return {activeEmploymentTypesList: updatedActiveEmploymentTypesList}
    })
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {jobsList, searchInputValue} = this.state
    const showJobsList = jobsList.length > 0

    return showJobsList ? (
      <div className="all-jobs-section">
        <div className="mobile-search-input-container">
          <input
            className="search-input"
            type="search"
            placeholder="Search"
            value={searchInputValue}
            onChange={this.onChangeSearchInput}
          />
          <button
            className="search-icon-button"
            testid="searchButton"
            type="button"
            onClick={this.onEnterSearchInput}
          >
            <BsSearch />
          </button>
        </div>
        <div className="responsive-container">
          <div className="profile-filters-container">
            <ProfileSection />
            <hr className="separator" />
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSalaryRange={this.changeSalaryRange}
              changeEmploymentType={this.changeEmploymentType}
            />
          </div>
          <div>
            <div className="desktop-search-input-container">
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
              />
              <button
                className="search-icon-button"
                testid="searchButton"
                type="button"
                onClick={this.onEnterSearchInput}
              >
                <BsSearch />
              </button>
            </div>
            <ul className="jobs-list-container">
              {jobsList.map(eachJob => (
                <JobCard jobDetails={eachJob} key={eachJob.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAllJobs()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default AllJobsSection
