import React, { useRef } from "react";
import {
  Grid,
  Paper,
  NativeSelect,
  TextInput,
  Text,
  Container,
  Group,
  ActionIcon,
  Image,
  Avatar,
  Stack,
  Menu,
  ScrollArea,
  Indicator,
  Select,
  Divider,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import {
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLocationOn,
} from "react-icons/md";
import { GrLocation, GrApps } from "react-icons/gr";
import { CiFacebook, CiTwitter, CiInstagram, CiYoutube } from "react-icons/ci";
import { ImWhatsapp } from "react-icons/im";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import MainMenu, { ListIcon } from "./components/Menu";
import Contact from "./components/Contact";
import Link from "next/link";
// import {IoLocationOutline} from 'react-icons/io';
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "@/redux/cart";
import { getWishlist } from "@/redux/wishlist";
import { getUser } from "@/redux/user";
import UserMenu from "./components/UserMenu";
import { searchProduct } from "@/lib/api/products";

function Header() {
  const [isDrop, setIsDrop] = useState(false);
  const [isUser, setUser] = useState({});
  const user = useSelector(getUser);
  const checkDate = new Date(Date.now());

  const [isVisible, setIsVisible] = useState(true);
  const [dropMenu, setDropMenu] = useState(false);
  const [height, setHeight] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const data = ["All Categories", "food", "drink"];
  // const tabData = [{value:}]
  const { cart } = useSelector(getCart);
  const { wishlist } = useSelector(getWishlist);
  const img_load = process.env.NEXT_PUBLIC_IPFS_URL;

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const listenToScroll = () => {
    let heightToHideFrom = 105;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setHeight(winScroll);

    if (winScroll > heightToHideFrom) {
      isVisible && setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    let cookieInfo = document.cookie.split("=")[1];
    console.log(cookieInfo);

    if (cookieInfo !== undefined) {
      const checkUser = JSON.parse(cookieInfo);
      setUser(checkUser);
    }
  }, [setUser]);

  /////// Search data when press Enter ///////////////
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      //Check if input valid
      if (!searchInput.replace(/\s/g, "").length) {
        getSearchedProduct([]);
      } else {
        const searchObject = {
          name: searchInput,
        };
        setSearchData([]);
        getSearchedProduct(searchObject);
        setDropMenu(true);
      }
    } else {
      setDropMenu(false);
    }
  };

  const getSearchedProduct = async (value) => {
    const [data, error] = await searchProduct("/menu/search", value);

    if (data) {
      setSearchData(data);
    }
  };
  ////////////////////////////////////////////////////////////////

  //// Detect and hide/show if click outside/inside search drop-menu ////
  const wrapperRef = useRef(null);
  const [isClickedOutside, setIsClickedOutside] = useState(true);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsClickedOutside(false);
    } else setIsClickedOutside(true);
  };
  ////////////////////////////////////////////////////////////////

  return (
    <Container
      style={{ maxWidth: 1539, zIndex: 100, position: "sticky", top: 0 }}
      p={0}
    >
      <Paper shadow="xs">
        <Grid
          style={{
            minHeight: 100,
            marginBottom: "10px",
            justifyContent: "center",
            margin: "auto",
          }}
          align="center"
          justify="center"
          columns={12}
        >
          <Grid.Col span={1}>
            <Link href="/">
              <Image
                size="md"
                width={50}
                fit="content"
                src="/images/logo.png"
                style={{ cursor: "pointer" }}
              ></Image>
            </Link>
          </Grid.Col>

          <Grid.Col span={2}>
            <TextInput
              ref={wrapperRef}
              onKeyDown={handleKeyDown}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
              rightSection={<FiSearch />}
              placeholder="Search..."
            />
            {dropMenu && searchData && isClickedOutside && (
              <ScrollArea
                style={{
                  border: "2px solid #ccc",
                  borderRadius: 5,
                  background: "white",
                  zIndex: 2,
                  marginTop: 10,
                  position: "fixed",
                  width: 498,
                  maxHeight: 198,
                }}
              >
                <Stack
                  p={5}
                  style={{
                    borderBottom: "0.5px solid #ccc",
                  }}
                >
                  {searchData.length > 0 &&
                    searchData.map((item) => (
                      <Group>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            border: "1px solid #ccc",
                            borderRadius: 3,
                          }}
                        >
                          <Image
                            src={img_load + item.image}
                            alt="image"
                            width="100%"
                            height="100%"
                            styles={{
                              root: { height: "100%" },
                              figure: { width: "100%", height: "100%" },
                              imageWrapper: { width: "100%", height: "100%" },
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <Link href={"/detail?id=" + item.id} key={item.id}>
                          <Text
                            style={{
                              cursor: "pointer",
                            }}
                            fz="sm"
                          >
                            {item.name}
                          </Text>
                        </Link>
                      </Group>
                    ))}
                </Stack>
              </ScrollArea>
            )}
          </Grid.Col>

          <Grid.Col span={2}>
            <Select
              data={data}
              itemProp={{ color: "green" }}
              // labelProps={style: {color: 'green'}}
              wrapperProps={{ border: "1px", boxshadow: "5px 8px" }}
              icon={<GrLocation size={14} className={styles.icon} />}
              rightSection={
                isDrop ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />
              }
              onDropdownOpen={() => setIsDrop(true)}
              onDropdownClose={() => setIsDrop(false)}
              defaultValue={data[0]}
            />
          </Grid.Col>
          {/* action icon */}
          <Grid.Col span={3}>
            <Group spacing="xs" grow position="center">
              <ActionIcon size="lg" variant="subtle" color="teal">
                <Link href="/wishlist" passHref>
                  <Group spacing="xs">
                    <Indicator
                      color="green"
                      withBorder
                      label={wishlist.length + ""}
                      dot={false}
                      showZero={false}
                      overflowCount={999}
                      inline
                      size={20}
                      radius="xl"
                    >
                      <AiOutlineHeart size={20} />
                    </Indicator>
                    <Text>Wishlist</Text>
                  </Group>
                </Link>
              </ActionIcon>

              <ActionIcon size="lg" variant="subtle" color="teal">
                <Link href="/cart" passHref>
                  <Group spacing="xs">
                    <Indicator
                      color="green"
                      withBorder
                      label={cart.length + ""}
                      dot={false}
                      showZero={false}
                      overflowCount={999}
                      inline
                      size={22}
                    >
                      <AiOutlineShoppingCart size={20} />
                    </Indicator>
                    <Text>Cart</Text>
                  </Group>
                </Link>
              </ActionIcon>

              {isUser && Object.keys(isUser).length > 0 ? (
                <UserMenu
                  isUser={isUser.role}
                  name={isUser.name}
                  onLogout={() => setUser(undefined)}
                />
              ) : (
                <ActionIcon size="sx" variant="subtle" color="teal">
                  <Link href="/login" replace>
                    <Group spacing="xs">
                      <AiOutlineUser size={20} />
                      <Text>Account</Text>
                    </Group>
                  </Link>
                </ActionIcon>
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper
        shadow="xs"
        style={{
          minHeight: 50,
          opacity: !isVisible ? "0" : "1",
          transition: "all 0.5s ease",
          visibility: !isVisible ? "hidden" : "visible",
        }}
      >
        <Group spacing="xl" className={styles.subHeader}>
          <NativeSelect
            data={["All Categories", "Food", "Drink"]}
            icon={<GrApps />}
            rightSection={<MdKeyboardArrowDown />}
          />

          <MainMenu
            data={[
              { title: "Home", path: "/" },
              { title: "About", path: "/about" },
              { title: "Shop", path: "/store" },
            ]}
          />

          <ListIcon
            data={[
              {
                icon: <CiFacebook size={18} />,
                path: "https://www.facebook.com/",
              },
              {
                icon: <CiTwitter size={18} />,
                path: "https://www.twitter.com/",
              },
              {
                icon: <CiInstagram size={18} />,
                path: "https://www.instagram.com/",
              },
              {
                icon: <CiYoutube size={18} />,
                path: "https://www.youtube.com/",
              },
              {
                icon: <ImWhatsapp size={18} />,
                path: "https://www.whatsapp.com/",
              },
            ]}
          />
          <Divider size="sm" orientation="vertical" />

          <Contact
            phoneNumber={"(xxx) xxx-xxxx"}
            dateTime={"Contact for help!"}
          />
        </Group>
      </Paper>
    </Container>
  );
}

export default Header;
