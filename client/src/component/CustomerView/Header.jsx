import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DealBaba from '../../assets/Dealbablogo.png';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { logout } from '../../../store/authSlice.js';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.setItem("qrCodeScan", "false");
    dispatch(logout());
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Disclosure as="nav" className="bg-gray-100 border-opacity-60 border-slate-700 fixed w-full top-0 left-0 z-30 shadow-lg">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="DealBaba"
                src={DealBaba}
                className="h-14 w-16"
              />
              <h1 className='ml-4 pt-4 text-2xl font-bold text-red-800'>DealBaba</h1>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to='/customer/customerCart'
                  className={classNames(
                    'text-black  hover:text-rose-700',
                    'rounded-md px-3 py-2 text-md font-semibold'
                  )}
                >
                  Customer Card
                </Link>
                <Link
                  to='/customer/allDeals'
                  className={classNames(
                    'text-black  hover:text-rose-700',
                    'rounded-md px-3 py-2 text-md font-semibold'
                  )}
                >
                  All Deals
                </Link>
              </div>
            </div>
            {/* Profile dropdown */}
            <div className="relative ml-6" ref={dropdownRef}>
            <div
                className="w-full flex text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 px-1 bg-white rounded-md shadow shadow-md"
                
              >
                <p className='text-black text-sm sm:text-lg py-2 px-1 font-semibold hidden sm:flex'>
                Hello,
                </p>
                <p className='text-black text-sm sm:text-lg py-2 px-1 font-semibold '>
                {user.name}
                </p>
                <button
                 className='pt-2 px-1 text-black'
                 onClick={toggleDropdown}
                 >
                {dropdownOpen ? '▲' : '▼'}
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden absolute z-30 w-full bg-gray-200">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            to='/customer/customerCart'
            className={classNames(
              'block rounded-md px-3 py-2 text-base font-medium text-black  hover:text-rose-700'
            )}
          >
            Customer Card
          </Link>
          <Link
            to='/customer/allDeals'
            className={classNames(
              'block rounded-md px-3 py-2 text-base font-medium text-black hover:text-rose-700'
            )}
          >
            All Deals
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
