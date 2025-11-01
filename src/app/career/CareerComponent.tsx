"use client"

import { Search, MapPin, Clock, Briefcase, Users, Filter, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

interface CareerComponentProps {
  careerData: any
}

export default function CareerComponent({ careerData }: CareerComponentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [expandedJob, setExpandedJob] = useState<number | null>(null)

  // Filter options
  const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "Operations"]
  const types = ["All", "Full-time", "Part-time", "Contract", "Internship"]
  const locations = ["All", "Remote", "Jakarta", "Bandung", "Surabaya", "Yogyakarta"]

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return careerData.positions.filter((job: any) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment
      const matchesType = selectedType === "All" || job.type === selectedType
      const matchesLocation = selectedLocation === "All" || job.location === selectedLocation

      return matchesSearch && matchesDepartment && matchesType && matchesLocation
    })
  }, [careerData.positions, searchTerm, selectedDepartment, selectedType, selectedLocation])

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  return (
    <div className="bg-[#f5f6f7]">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Karir
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan posisi yang sesuai dengan passion dan skill Anda. Bergabunglah dengan tim yang inovatif dan berkembang pesat.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari posisi, skill, atau keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent transition-all duration-300 bg-white"
          />
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent appearance-none bg-white cursor-pointer border-0"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Job Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent appearance-none bg-white cursor-pointer border-0"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent appearance-none bg-white cursor-pointer border-0"
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center px-4 py-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">
              {filteredJobs.length} posisi ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: any) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => toggleJobExpansion(job.id)}
            >
              {/* Job Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-custom-red transition-colors duration-300">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.experience}</span>
                    </div>
                  </div>
                </div>
                
                {/* Expand/Collapse Button */}
                <div className="mt-4 md:mt-0">
                  <button className="text-custom-red hover:text-red-600 transition-colors duration-300">
                    <ChevronDown 
                      className={`w-5 h-5 transform transition-transform duration-300 ${
                        expandedJob === job.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Job Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {job.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-custom-red/10 text-custom-red text-xs font-medium rounded-full border border-custom-red/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Expanded Content */}
              {expandedJob === job.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2 mb-6">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="w-2 h-2 bg-custom-red rounded-full mt-2 flex-shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-custom-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300">
                      Lamar Sekarang
                    </button>
                    <button className="border border-custom-red text-custom-red px-6 py-3 rounded-xl font-semibold hover:bg-custom-red hover:text-white transition-all duration-300">
                      Simpan Posisi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4">Kami mohon maaf, saat ini tidak ada lowongan yang tersedia.</h3>
              <p className="text-yellow-700 mb-6 leading-relaxed">
                Namun, jika Anda tertarik bergabung dengan tim kami, silakan kirimkan CV Anda ke email kami: 
                <span className="font-semibold text-yellow-900"> hr@welcomplay.com</span>
              </p>
              <p className="text-yellow-600 text-sm">
                Kami akan dengan senang hati menyimpannya untuk kesempatan mendatang.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
