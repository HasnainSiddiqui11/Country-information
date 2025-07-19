"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Globe, Search, Users, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Country {
  name: {
    common: string
    official: string
  }
  capital?: string[]
  region: string
  subregion?: string
  languages?: { [key: string]: string }
  currencies?: { [key: string]: { name: string; symbol: string; code?: string } }
  flags: {
    png: string
    svg: string
  }
  cca2: string
  population?: number
  area?: number
}

interface Person {
  id: string
  name: string
  email: string
  phone: string
  country: string
  city: string
}

export default function CountryInfoViewer() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContinent, setSelectedContinent] = useState("All")
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCountryDetails, setSelectedCountryDetails] = useState<Country | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [persons, setPersons] = useState<Person[]>([])
  const [personForm, setPersonForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
  })

  const [counter, setCounter] = useState(0)

  const incrementCounter = () => setCounter((prev) => prev + 1)
  const decrementCounter = () => setCounter((prev) => prev - 1)

  const continents = ["All", "Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"]

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    filterCountries()
  }, [countries, searchTerm, selectedContinent])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,languages,currencies,flags,cca2,population,area",
      )
      const data = await response.json()
      const sortedData = data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common))
      setCountries(sortedData)
    } catch (error) {
      console.error("Error fetching countries:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCountries = () => {
    let filtered = countries

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((country) => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by continent
    if (selectedContinent !== "All") {
      filtered = filtered.filter((country) => country.region === selectedContinent)
    }

    setFilteredCountries(filtered)
  }

  const getCurrencyCode = (currencies: { [key: string]: { name: string; symbol: string; code?: string } }) => {
    const currencyKeys = Object.keys(currencies)
    if (currencyKeys.length > 0) {
      return currencyKeys[0]
    }
    return "N/A"
  }

  const getLanguages = (languages: { [key: string]: string }) => {
    const languageValues = Object.values(languages)
    if (languageValues.length > 2) {
      return `${languageValues.slice(0, 2).join(", ")}, ...`
    }
    return languageValues.join(", ")
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const openCountryModal = (country: Country) => {
    setSelectedCountryDetails(country)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCountryDetails(null)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const handlePersonSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (personForm.name && personForm.email && personForm.country) {
      const newPerson: Person = {
        id: Date.now().toString(),
        ...personForm,
      }
      setPersons((prev) => [...prev, newPerson])
      setPersonForm({
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
      })
    }
  }

  const deletePerson = (id: string) => {
    setPersons((prev) => prev.filter((person) => person.id !== id))
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
      >
        <div className={`text-xl flex items-center gap-3 ${darkMode ? "text-white" : "text-blue-700"}`}>
          <Globe className="animate-spin w-6 h-6" />
          Loading countries...
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <div
        className={`${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-gradient-to-r from-slate-800 to-gray-800 shadow-lg"} p-6`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Globe className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-white"}`} />
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-white"}`}>Country Explorer</h1>
          </div>
          <Button
            onClick={toggleDarkMode}
            variant="outline"
            size="sm"
            className={`${
              darkMode
                ? "border-gray-600 text-white hover:bg-gray-700 hover:text-white"
                : "border-white text-white hover:bg-white hover:text-gray-900"
            } font-medium`}
          >
            {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>

      {/* Counter Heading */}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Counter</h2>
          <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Use the buttons below to increment or decrement the counter
          </p>
        </div>
      </div>

      {/* Counter Section */}
      <div
        className={`${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md"} py-4`}
      >
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
          <Button
            onClick={decrementCounter}
            variant="outline"
            size="sm"
            className={`w-12 h-12 rounded-full font-bold text-lg ${darkMode ? "border-gray-600 text-white hover:bg-gray-700" : "border-white/30 text-white hover:bg-white/10"} backdrop-blur-sm`}
          >
            -
          </Button>
          <div
            className={`${darkMode ? "bg-gray-700 text-white" : "bg-white/90 text-blue-700"} px-8 py-3 rounded-xl font-bold text-xl min-w-[100px] text-center shadow-lg backdrop-blur-sm`}
          >
            {counter}
          </div>
          <Button
            onClick={incrementCounter}
            variant="outline"
            size="sm"
            className={`w-12 h-12 rounded-full font-bold text-lg ${darkMode ? "border-gray-600 text-white hover:bg-gray-700" : "border-white/30 text-white hover:bg-white/10"} backdrop-blur-sm`}
          >
            +
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Section */}
        <Card
          className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-xl border-blue-200"} overflow-hidden`}
        >
          <div
            className={`h-1 ${darkMode ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
          ></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <h2 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                Search Countries
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                  Search by Name
                </label>
                <Input
                  placeholder="Enter country name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "border-blue-300 focus:border-blue-500"}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                  Filter by Continent
                </label>
                <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                  <SelectTrigger
                    className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-blue-300"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {continents.map((continent) => (
                      <SelectItem key={continent} value={continent}>
                        {continent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countries Count */}
        <div className="mb-6">
          <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            <MapPin className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            Countries ({filteredCountries.length} found)
          </h3>
        </div>

        {/* Countries Grid - Limited to 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.slice(0, 10).map((country) => (
            <Card
              key={country.cca2}
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-blue-500"
                  : "bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl border-blue-200 hover:border-blue-400"
              } transition-all duration-300 cursor-pointer transform hover:scale-105 group overflow-hidden`}
              onClick={() => openCountryModal(country)}
            >
              <div
                className={`h-1 ${darkMode ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-blue-400 to-indigo-400"} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              ></div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h4
                    className={`font-bold text-lg ${darkMode ? "text-white group-hover:text-blue-400" : "text-gray-800 group-hover:text-blue-600"} transition-colors`}
                  >
                    {country.name.common}
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Capital:</span>
                      <span className={darkMode ? "text-white" : "text-gray-700"}>{country.capital?.[0] || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Currency:</span>
                      <span className={darkMode ? "text-white" : "text-gray-700"}>
                        {country.currencies ? getCurrencyCode(country.currencies) : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Continent:</span>
                      <span className={darkMode ? "text-white" : "text-gray-700"}>{country.region}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Languages:</span>
                      <span className={darkMode ? "text-white" : "text-gray-700"}>
                        {country.languages ? getLanguages(country.languages) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show more message if there are more than 10 countries */}
        {filteredCountries.length > 10 && (
          <div className="text-center mt-6">
            <p
              className={`text-sm ${darkMode ? "text-gray-400 bg-gray-800/60" : "text-gray-600 bg-white/60"} backdrop-blur-sm rounded-full px-6 py-2 inline-block`}
            >
              Showing 10 of {filteredCountries.length} countries. Use search or filter to narrow results.
            </p>
          </div>
        )}

        {/* No Results */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-16">
            <Globe className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No countries found matching your criteria.
            </p>
          </div>
        )}

        {/* Country Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className={`max-w-3xl ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-blue-200"}`}
          >
            <DialogHeader>
              <DialogTitle
                className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                <Globe className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                {selectedCountryDetails?.name.common}
              </DialogTitle>
            </DialogHeader>

            {selectedCountryDetails && (
              <div className="space-y-8">
                <div className="flex items-start gap-8">
                  <img
                    src={selectedCountryDetails.flags.png || "/placeholder.svg"}
                    alt={`Flag of ${selectedCountryDetails.name.common}`}
                    className="w-40 h-24 object-cover rounded-lg border-2 border-blue-200 shadow-lg"
                  />

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className={`font-semibold mb-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        Official Name
                      </h3>
                      <p className={`text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {selectedCountryDetails.name.official}
                      </p>
                    </div>

                    <div>
                      <h3 className={`font-semibold mb-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Capital</h3>
                      <p className={`text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {selectedCountryDetails.capital?.[0] || "N/A"}
                      </p>
                    </div>

                    <div>
                      <h3 className={`font-semibold mb-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Region</h3>
                      <p className={`text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {selectedCountryDetails.region}
                        {selectedCountryDetails.subregion && ` - ${selectedCountryDetails.subregion}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Population</h3>
                    <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {selectedCountryDetails.population ? formatNumber(selectedCountryDetails.population) : "N/A"}
                    </p>
                  </div>

                  <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>Area</h3>
                    <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {selectedCountryDetails.area ? `${formatNumber(selectedCountryDetails.area)} km²` : "N/A"}
                    </p>
                  </div>

                  <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                      Currencies
                    </h3>
                    <p className={`text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {selectedCountryDetails.currencies
                        ? Object.entries(selectedCountryDetails.currencies)
                            .map(([code, currency]) => `${currency.name} (${currency.symbol || code})`)
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>

                  <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                      Languages
                    </h3>
                    <p className={`text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {selectedCountryDetails.languages
                        ? Object.values(selectedCountryDetails.languages).join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Person Details Section */}
        <div className="mt-16">
          <Card
            className={`mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-xl border-green-200"} overflow-hidden`}
          >
            <div
              className={`h-1 ${darkMode ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-green-500 to-blue-500"}`}
            ></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                <h2 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Add Person Details
                </h2>
              </div>
              <form onSubmit={handlePersonSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                      Full Name *
                    </label>
                    <Input
                      value={personForm.name}
                      onChange={(e) => setPersonForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                      className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "border-green-300 focus:border-green-500"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={personForm.email}
                      onChange={(e) => setPersonForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                      className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "border-green-300 focus:border-green-500"}`}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                      Phone Number
                    </label>
                    <Input
                      value={personForm.phone}
                      onChange={(e) => setPersonForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "border-green-300 focus:border-green-500"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                      City
                    </label>
                    <Input
                      value={personForm.city}
                      onChange={(e) => setPersonForm((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                      className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "border-green-300 focus:border-green-500"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-700"}`}>
                    Country *
                  </label>
                  <Select
                    value={personForm.country}
                    onValueChange={(value) => setPersonForm((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger
                      className={`h-12 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-green-300"}`}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.cca2} value={country.name.common}>
                          {country.name.common}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg"
                >
                  Add Person
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Person Details List */}
          {persons.length > 0 && (
            <Card
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm shadow-xl border-purple-200"} overflow-hidden`}
            >
              <div
                className={`h-1 ${darkMode ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gradient-to-r from-purple-500 to-blue-500"}`}
              ></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className={`w-6 h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                  <h3 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Added Persons ({persons.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {persons.map((person) => (
                    <div
                      key={person.id}
                      className={`p-6 border rounded-xl ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 hover:bg-gray-650"
                          : "border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100"
                      } transition-all duration-300 hover:shadow-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <h4 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {person.name}
                          </h4>
                          <p
                            className={`${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center gap-4 flex-wrap`}
                          >
                            <span>📧 {person.email}</span>
                            <span>🌍 {person.country}</span>
                            {person.phone && <span>📱 {person.phone}</span>}
                            {person.city && <span>🏙️ {person.city}</span>}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePerson(person.id)}
                          className={`text-red-500 hover:text-red-700 ${darkMode ? "border-gray-600 hover:bg-red-900/20" : "hover:bg-red-50"}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
