import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import Pagination from '../pagination/Pagination';
import './style.scss'
import './Hover.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from '../user-profile/Profile'
import { UserContext } from '../context/AuthContext'





//This All_books function requests for All the book data and stores it in array named books
let PageSize = 4;
function Books({ setUrl, mylibrarybooks, setDrawerTab }) {

  //states to set book cover page as icons
  let {user, setUser} = useContext(UserContext)
  const [liked, setLikedBooks] = useState([])

  useEffect(()=>{
    if(user.personalisation.liked) {
      setLikedBooks(user.personalisation.liked)
    }
  },[user])

  const [isprofile, setisprofile] = useState(false);
  const HandleAuthors = ({ authors }) => {
    const [authorString, setAuthorString] = useState("")
    useEffect(() => {
      if (authors) {
        let str = ""
        authors.forEach(author => {
          str += author.first_name + " " + author.last_name + ", "
        })
        str = str.substring(0, str.length - 2);
        setAuthorString(str)
      }
    }, [authors])
    return (<div>{authorString}</div>)
  }
  const [books, setBooks] = useState([])
  const [booksupdated, setBooksUpdated] = useState(false)
  // This hook fetches all books 
  useEffect(() => {
    async function getAllBooks() {
      try {
        const Books = await axios.get('http://127.0.0.1:8000/library/')
        setBooks(Books.data)
        setBooksUpdated(true)
      } catch (error) {
        console.log(error)
      }
    }
    getAllBooks()
  }, [])

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "/epub.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  //This hook maps the book array and adds one more property to array of object namely imgurl which is used to display as icon of book
  const [imgval, setimgval] = useState(0);

  useEffect(() => {
    const updatedBooks = () => {
      var count = 0;
      let newbooks = books.map((item) => {
        if (item.description) {
          var desc = window.ePub(item.description);
          desc.coverUrl().then((data) => {
            item.imageurl = data;
            count = count + 1;
            setimgval(count);
          })
        }
        return item
      })
      setBooks(newbooks)
    }
    if(booksupdated) {
      updatedBooks()
      setBooksUpdated(false)
    }
  }, [booksupdated])


  //This get request will fetch mylibrary books from user profile


  // This function adds new book to mylibrarybooks if its not there
  const addtomylibrary = async (book) => {
    var isFound = 0;
    // This function checks if book is already in the mylibrary
    mylibrarybooks.some(element => {
      if (element.id === book.id) {
        isFound = 1;
      }
    });

    if (isFound === 0) {
      mylibrarybooks.push(book)
      // await axios.put(`${url}`,{id:2,mylibrary:mylibrarybooks})
    }
  }


  //This function adds new book to likedBooks array if its not there
  const likeClick = async(book) => {
      let likedbooks = user.personalisation.liked
      likedbooks.push(book.id)
      // console.log({...user.personalisation, liked:likedbooks})
      let res = await axios({
        method: 'put',
        url: 'http://localhost:8000/personalisation/'+user.personalisation.id+'/',
        data:{...user.personalisation, liked:likedbooks},
        withCredentials: true
      });
      setLikedBooks(res.data.liked)
  }

  //This function renders all books    

  function Items({ currentItems }) {
    // console.log(currentItems);
    return (

      <div className="books_container" style={{
        height: 'auto',
        display: 'flex',
        color: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '8px',
        top: '10%',
        order: 1,
        flexGrow: 1,
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        maxWidth: '1200px'
      }}



      >

        {
          currentItems && (imgval) &&
          currentItems.map((book, i) => {
            return (
              <div className='book_out' style={{
                height: '504px',
                width: '278px',
                borderRadius: '8px',
                paddingLeft: '0px',
                paddingTop: '0px',
                gap: '24px',
                border: '1px solid #EFEFFD',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '1 1 139px',
                order: '0',
                flexGrow: '0',
                boxSizing: 'border-box',
              }} key={i}>

                <div className="book_desc_button" style={{
                  height: '360px',
                  paddingLeft: '0px',
                  width: '246px',
                  borderRadius: '8px',
                  margin: '16px 16px 0px 16px',
                  border: '1px solid #EFEFFD',
                  boxSizing: 'border-box',
                  flex: 'none',
                  order: '0',
                  flexGrow: '0',
                  alignItems: 'center',
                  backgroundImage: `url(${book.imageurl})`,
                  backgroundSize: '100% 100%'
                }}>
                  <div >
                    {liked.includes(book.id) ? <FavoriteIcon style={{ color: "red" }}
                      onClick={() => {
                        likeClick(book)
                      }} /> : <FavoriteIcon
                      onClick={() => {
                        likeClick(book)
                      }} />}
                    {/* <i class='fa fa-heart red-color' onClick={()=> {
                      likeClick(book)}} style={{color:'red'}}></i> */}
                  </div>
                  <div className="book_description" style={{
                    height: '184px',
                    width: '234px',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    position: 'absolute',
                    marginTop: '30px',
                    marginLeft: '6px',
                    fontFamily: 'Work Sans',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '15px',
                    lineHeight: '28px',
                    letterSpacing: '-0.02em',
                    color: '#',
                  }}>
                    This section is all about description of book. Description of book gives us brief idea of what the book is all about and is also one of the main component of book which can either make reader read the book or not.
                  </div>
                  <button className="book_read_button" style={{
                    position: 'absolute',
                    marginTop: '276px',
                    height: '48px',
                    width: '94px',
                    borderRadius: '8px',
                    padding: '12px 24px 12px 24px',
                    boxSizing: 'border-box',
                    gap: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #EFEFFD',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: '73px',
                    fontFamily: 'Work sans',
                    fontWeight: '700',
                    fontSize: '16px',
                    lineHeight: '19px',
                    letterSpacing: '0.04em',
                    color: '#428CFB',
                    fontStyle: 'normal',
                    textAlign: 'center'
                  }} onClick={() => { setUrl(book.description); addtomylibrary(book); setDrawerTab(2) }} >READ
                  </button>
                </div>
                <div style={{
                  height: '88px',
                  width: '246px',
                  marginTop: '0px',
                  marginLeft: '16px',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 'none',
                  order: '1',
                  alignSelf: 'stretch',
                  flexGrow: '0',
                }}>
                  <h2 style={{
                    textAlign: 'left',
                    color: '#0E0E2C',
                    width: '246px',
                    height: '28px',
                    marginTop: '4px',
                    marginBottom: '0px',
                    fontFamily: 'Work Sans',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '17px',
                    lineHeight: '28px',
                    letterSpacing: '-0.02em',
                    flex: 'none',
                    order: '0',
                    alignSelf: 'stretch',
                    flexGrow: '0',
                  }}>
                    {book.title}
                  </h2>
                  <div style={{
                    width: '246px',
                    height: '44px',
                    textAlign: 'left',
                    color: '#4A4A68',
                    fontFamily: 'Work Sans',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '16px',
                    lineHeight: '22px',
                    flex: 'none',
                    order: '1',
                    alignSelf: 'stretch',
                    flexGrow: '0'
                  }}>
                    <div style={{
                      textAlign: 'left',
                      color: '#4A4A68',
                      fontFamily: 'Work Sans',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '22px',
                      flex: 'none',
                      order: '1',
                      alignSelf: 'stretch',
                      flexGrow: '0'
                    }}><HandleAuthors authors={book.author} />
                    </div>
                    <div style={{
                      textAlign: 'left',
                      color: '#4A4A68',
                      fontFamily: 'Work Sans',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '16px',
                      lineHeight: '22px',
                      letterSpacing: '-0.02em',
                      flex: 'none',
                      order: '1',
                      alignSelf: 'stretch',
                      flexGrow: '0'
                    }}>{book.year}
                    </div>
                  </div>
                </div>
              </div>

            )
          }
          )

        }

      </div>

    );
  }
  //setting intitial page number as 1
  const [currentPage, setCurrentPage] = useState(1);
  //function to get array of number of books we want to render
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return books.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, books]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', width: '192px' }}>
          <p style={{ marginTop: '16px', marginBottom: 0, width: '136px', textAlign: 'right' }}>Hariharan</p>
          <AccountCircleIcon style={{ marginRight: '16px', marginTop: '16px' }} onClick={() => setisprofile(!isprofile)} />
        </div>

      </div>
      {(!isprofile) ? <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
      }}>
        <div style={{
          height: 'auto',
          maxWidth: '100%',
          padding: '8px 0 0px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',

          background: '#FFFFFF',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF'
        }}>

          <h3 style={{
            color: '#000000',
            height: 'auto',
            width: '279px',
            marginTop: '8px',
            textAlign: 'left',
            fontFamily: 'Work Sans',
            fontWeight: '500',
            fontSize: '24px',
            marginBottom: '0px',
            lineHeight: '28px',
            letterSpacing: '-2%',
            flex: 'none',

            order: 0,
            flexGrow: 0
          }}>Based on your interests</h3>
          <Items currentItems={currentTableData} >

          </Items>


        </div>
        <div style={{
          position: 'relative',
        }}>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={books.length}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)} />
        </div>
      </div> : <Profile />}
    </>

  );
}

export { Books };