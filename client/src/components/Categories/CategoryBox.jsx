import PropTypes from 'prop-types'
import queryString from 'query-string';
import { useNavigate, useSearchParams } from 'react-router-dom';


const CategoryBox = ({ label, icon: Icon }) => {
  const [params, setParams] = useSearchParams() //thake the current query parameters from the url and setParams is used to update the query parameters in the url. we will use this to update the category query parameter in the url when user click on the category box. so that we can filter the rooms data based on the category query parameter in the url. for example when user click on the beach category box then we will update the url to /?category=beach and then we can filter the rooms data based on the category query parameter in the url. so here we will check if category query parameter is present in the url then we will filter the rooms data based on that category otherwise we will return all rooms data.
  const category = params.get('category') 

  const navigate = useNavigate()
  const handleClick = ()=>{
    let currentQuery = {category: label}
    const url = queryString.stringifyUrl({
      url: '/',
      query: currentQuery
    })
    // console.log(url);
    // console.log(url);
    navigate(url)
    
  }
  return (
    <div
    onClick={handleClick}
      className={`flex 
  flex-col 
  items-center 
  justify-center 
  gap-2
  p-3
  border-b-2
  hover:text-neutral-800
  transition
  cursor-pointer ${category === label && 'border-b-neutral-800 text-neutral-800' }  `}
    >
      <Icon size={26} />
      <div className='text-sm font-medium'>{label}</div>
    </div>
  )
}

CategoryBox.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
}

export default CategoryBox
