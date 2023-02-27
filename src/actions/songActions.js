import { fakeSongLyrics, fakeSongsList } from '../fakeData/data';

const baseUrl = new URL('https://api.lyrics.ovh');

const getSongs = async ({
  setLoading,
  setData,
  setAlert,
  searchKeyword = '',
}) => {
  if (searchKeyword.trim() === '') return;
  setLoading(true);
  try {
    const apiUrl = new URL(`${baseUrl}suggest/${searchKeyword}`);
    const res = await fetch(apiUrl);
    const data = await res.json();
    setData(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setAlert({ message: 'API Error: Showing fake data ', type: 'error' });
    setData(fakeSongsList);
    setLoading(false);
  }
};

const getMoreSongs = async ({
  setLoading,
  setData,
  setAlert,
  searchKeyword,
  index,
  songsList,
}) => {
  setLoading(true);
  try {
    const apiUrl = new URL(`${baseUrl}suggest/${searchKeyword}&index=${index}`);
    const res = await fetch(apiUrl);
    const data = await res.json();
    setData({ ...songsList, data: [...songsList.data, ...data.data] });
    setLoading(false);
  } catch (error) {
    // ? using Static Error as api don't return error message
    setAlert({ message: 'Failed to Fetch', type: 'error' });
    console.log(error);
    setLoading(false);
  }
};

const handleNoLyricsFound = (setAlert, setData, setLoading) => {
  setAlert({
    message: 'API Error: No lyrics present showing fake lyrics ',
    type: 'error',
  });
  setData(fakeSongLyrics);
  setLoading(false);
};

const getSongLyrics = async ({
  setLoading,
  setData,
  setAlert,
  artistName,
  song,
}) => {
  setLoading(true);
  try {
    const apiUrl = new URL(`${baseUrl}v1/${artistName}/${song}`);
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.lyrics) {
      setData(data.lyrics);
      setLoading(false);
    } else {
      handleNoLyricsFound(setAlert, setData, setLoading);
    }
  } catch (error) {
    handleNoLyricsFound(setAlert, setData, setLoading);
  }
};

const songActions = { getSongs, getMoreSongs, getSongLyrics };

export default songActions;
