import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//Import libraries for storage and navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

//MOCK CARD DATA
// Mock Card presets
//Id is used to find when being called
//Game is what kind of card it is
//Name is either the player or character name
//type is for what kind of card it is
//set is used to know what set it is from, since many players and characters have multiple different cards
const MOCK_CARDS = [
  {
    id: 'mtg-card-1',
    game: 'Magic: The Gathering',
    name: 'Terror of the Peaks',
    set: 'Outlaws of Thunder Junction',
    type: 'Creature',
    team: null,
    image: null,
  },

  {
    id: 'mtg-card-2',
    game: 'Magic: The Gathering',
    name: 'Bello, Bard of the Brambles',
    set: 'Bloomburrow',
    type: 'Creature',
    team: null,
    image: null,
  },

  {
    id: 'mtg-card-3',
    game: 'Magic: The Gathering',
    name: 'Chronicle of Victory',
    set: 'Lorwyn Eclipsed',
    type: 'Legendary Artifact',
    team: null,
    image: null,
  },

  {
    id: 'poke-card-1',
    game: 'Pokémon',
    name: 'Charmander',
    set: 'Base Set 1st Edition',
    type: 'Pokémon',
    team: null,
    image: null,
  },

  {
    id: 'poke-card-2',
    game: 'Pokémon',
    name: 'Shinx',
    set: 'Hidden Fates',
    type: 'Pokémon',
    team: null,
    image: null,
  },

  {
    id: 'sport-card-1',
    game: 'Sports Cards',
    name: 'Ernest Jones IV',
    set: '2025 Prizm',
    grade: 10,
    type: 'Football',
    team: 'Seahawks',
    image: null,
  },

  {
    id: 'sport-card-2',
    game: 'Sports Cards',
    name: 'Caleb Williams',
    set: '2025 Topps Chrome',
    type: 'Football',
    team: 'Bears',
    image: null,
  },

  {
    id: 'sport-card-3',
    game: 'Sports Cards',
    name: 'Aaron Judge',
    set: '2017 Topps Chrome',
    type: 'Baseball',
    team: 'Yankees',
    image: null,
  },
];

//MOCK EVENTS
//id is for finding the event when it is called
//Name is what the event is called
//zip is used so users can enter their zip code and find events near then
//Type is for people to know what they are getting themselves into when they go to these events
const MOCK_EVENTS = [
  {
    id: 'event1',
    name: 'Magic the Gathering: Friday Night Magic',
    zip: '10001',
    type: 'Casual Play',
  },

  {
    id: 'event2',
    name: 'Pokémon League Cup',
    zip: '10002',
    type: 'Tournament',
  },

  {
    id: 'event3',
    name: 'The Flippin Card Show!',
    zip: '10003',
    type: 'Card Show',
  },

  {
    id: 'event4',
    name: 'Learn to Play + Starter Deck Building',
    zip: '10004',
    type: 'Community Meetup',
  },
];

//MOCK PREMADE DECKS
// id is what gets called when the user looks for a deck
//owner label determines if the user made the deck or made by a company
//Name you give your deck
//Game is what game you are playing
const MOCK_PREMADE_DECKS = [
  {
    id: 'deck1',
    ownerLabel: 'Premade Deck',
    name: 'Enchantments and Artifacts',
    game: 'Magic: The Gathering',

    cards: [
      {
        cardId: 'mtg-card-1',
        qty: 1,
      },

      {
        cardId: 'mtg-card-2',
        qty: 1,
      },
    ],
  },

  {
    id: 'deck2',
    ownerLabel: 'Premade Deck',
    name: 'Three Starters Control',
    game: 'Pokémon',

    cards: [
      {
        cardId: 'poke-card-1',
        qty: 1,
      },

      {
        cardId: 'poke-card-2',
        qty: 1,
      },
    ],
  },

  {
    id: 'deck3',
    ownerLabel: 'Premade Deck',
    name: 'Squirrels and Friends',
    game: 'Magic: The Gathering',

    cards: [
      {
        cardId: 'mtg-card-2',
        qty: 1,
      },

      {
        cardId: 'mtg-card-3',
        qty: 1,
      },
    ],
  },
];

//MOCK PREMADE BINDER
//id is where in the binder would go
//title is the name of the card in the binder
//Card ID is so we can know which card they want
const MOCK_PREMADE_BINDER = [
  {
    id: 'binder-card-1',
    title: 'My Terror of the Peaks',
    cardId: 'mtg-card-1',
  },

  {
    id: 'binder-card-2',
    title: 'Favorite Pokémon',
    cardId: 'poke-card-1',
  },

  {
    id: 'binder-card-3',
    title: 'My Aaron Judge Card',
    cardId: 'sport-card-3',
  },
];

//MOCK SHOP LISTINGS
//id is unique for the listing
//card calls mtg-card-1 from our card data, and puts it in listing
//price of card
//Condition is how good the quality of the card is
//seller name is the username of the person selling it
const MOCK_LISTINGS = [
  {
    id: 'listing-1',
    cardId: 'mtg-card-1',
    price: 25.0,
    condition: 'Near Mint',
    sellerName: 'CardCollector',
  },

  {
    id: 'listing-2',
    cardId: 'mtg-card-2',
    price: 18.5,
    condition: 'Mint',
    sellerName: 'ManaTrader',
  },

  {
    id: 'listing-3',
    cardId: 'poke-card-1',
    price: 42.0,
    condition: 'Lightly Played',
    sellerName: 'PokeFan',
  },

  {
    id: 'listing-4',
    cardId: 'poke-card-2',
    price: 12.75,
    condition: 'Near Mint',
    sellerName: 'ShinyCards',
  },

  {
    id: 'listing-5',
    cardId: 'sport-card-1',
    price: 30.0,
    condition: 'Mint',
    sellerName: 'SportsVault',
  },

  {
    id: 'listing-6',
    cardId: 'sport-card-3',
    price: 55.0,
    condition: 'Near Mint',
    sellerName: 'BaseballCards',
  },
];

//STORAGE KEYS
//This is for saving our data. Data keys helps with avoiding typos and makes it easier to change names later on
const STORAGE_KEYS = {
  auth: 'auth_token',
  decks: 'decks_mock',
  binder: 'binder_mock',
  cart: 'cart_mock',
};


////Looks up the card in MOCK_CARDS by the ID.
//It takes in the cardId and outputs the matching card, or prints undefined
function findCard(cardId) {
  return MOCK_CARDS.find((card) => card.id === cardId);
}
//Formats numerical value into a money string
//This makes the price look like "$4.00" instead of "4.00"
function formatMoney(value) {
  const number = Number(value);
  //Checks that the number is a real finite number
  return `$${(Number.isFinite(number) ? number : 0).toFixed(2)}`;
}

function normalizeZip(zip) {
  return String(zip || '')
    .replace(/\D/g, '')
    .slice(0, 5);
}

//LOGIN SCREEN
//This is our code for our login screen that we have on the app 
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
//Caled when the user clicks login 
  const onLogin = async () => {

    //Basic validation, if there is no email or password it exits the program 
    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.auth, 'mock_token');

      navigation.replace('Main');
    } catch (error) {
      console.warn('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginScreen}>
      <View style={styles.container_view}>
        <Text style={styles.title_text}>Binder Collection Lounge</Text>

        <TextInput
          style={styles.input_view}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input_view}
          placeholder="Password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.login_button}
          onPress={onLogin}
          disabled={loading}>
          <Text style={styles.button_text}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// function for botton tab bar where user can go from screen to screen
function BottomTabBar({ activeTab, onSelect }) {
  const tabs = [
    {
      key: 'Shop',
      label: 'Shop',
    },

    {
      key: 'Decks',
      label: 'Decks',
    },

    {
      key: 'Binder',
      label: 'Binder',
    },

    {
      key: 'Events',
      label: 'Events',
    },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            onPress={() => onSelect(tab.key)}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Screen for shop this is where user can see what cards are for sale
function ShopScreen({ onAddToCart, cartCount }) {
  const listings = MOCK_LISTINGS;

  const [query, setQuery] = useState('');
  const [filterGame, setFilterGame] = useState('All');

  const games = ['All', 'Magic: The Gathering', 'Pokémon', 'Sports Cards'];

  const filteredListings = useMemo(() => {
    const search = query.trim().toLowerCase();

    return listings.filter((listing) => {
      const card = findCard(listing.cardId);

      if (!card) {
        return false;
      }

      const matchesGame = filterGame === 'All' || card.game === filterGame;

      const searchableText = [
        card.name,
        card.game,
        card.set,
        card.type,
        card.team || '',
        listing.condition,
        listing.sellerName,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        search.length === 0 || searchableText.includes(search);

      return matchesGame && matchesSearch;
    });
  }, [listings, query, filterGame]);

  return (
    <ScrollView
      contentContainerStyle={styles.screenPad}
      keyboardShouldPersistTaps="handled">
      <View style={styles.rowBetween}>
        <Text style={styles.screenTitle}>Shop</Text>

        <Text style={styles.cartPill}>Cart: {cartCount}</Text>
      </View>

      <Text style={styles.sectionLabel}>Search</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by name / set / type / team"
        placeholderTextColor="#777"
        value={query}
        onChangeText={setQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}>
        <View style={styles.horizontalRow}>
          {games.map((game) => {
            const active = filterGame === game;

            return (
              <TouchableOpacity
                key={game}
                onPress={() => setFilterGame(game)}
                style={[styles.chip, active && styles.chipActive]}>
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}>
                  {game}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
        Items on Sale
      </Text>

      <View style={styles.listGap}>
        {filteredListings.map((listing) => {
          const card = findCard(listing.cardId);

          if (!card) {
            return null;
          }

          return (
            <View key={listing.id} style={styles.cardListing}>
              <Text style={styles.cardListingTitle}>{card.name}</Text>

              <Text style={styles.cardListingMeta}>
                {card.game} • {card.set}
              </Text>

              <Text style={styles.cardListingMeta}>Type: {card.type}</Text>

              {card.team ? (
                <Text style={styles.cardListingMeta}>Team: {card.team}</Text>
              ) : null}

              {card.grade ? (
                <Text style={styles.cardListingMeta}>Grade: {card.grade}</Text>
              ) : null}

              <Text style={styles.price}>{formatMoney(listing.price)}</Text>

              <Text style={styles.cardListingMeta}>
                Condition: {listing.condition}
              </Text>

              <Text style={styles.cardListingMeta}>
                Seller: {listing.sellerName}
              </Text>

              <Pressable
                style={styles.buttonSmall}
                onPress={() => onAddToCart(listing)}>
                <Text style={styles.buttonSmallText}>Add to Cart</Text>
              </Pressable>
            </View>
          );
        })}

        {filteredListings.length === 0 ? (
          <Text style={styles.emptyText}>No listings match your search.</Text>
        ) : null}
      </View>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}

// Screen for decks where user can build different decks
function DecksScreen({ decks, setDecks }) {
  const [creating, setCreating] = useState(false);

  const [newDeckName, setNewDeckName] = useState('');

  const [newDeckGame, setNewDeckGame] = useState('Magic: The Gathering');

// Imports the premade cards 
  const importPremade = (premade) => {
    const newDeck = {
      id: `user-deck-${Date.now()}-${Math.random().toString(16).slice(2)}`,

      ownerLabel: 'You',

      name: premade.name,

      game: premade.game,

      cards: premade.cards.map((card) => ({
        ...card,
      })),

      createdAt: Date.now(),
    };

    setDecks((previous) => [newDeck, ...previous]);
  };

// How card decks are made
  const createDeck = () => {
    const name = newDeckName.trim();

    if (!name) {
      return;
    }

    const deck = {
      id: `user-deck-${Date.now()}-${Math.random().toString(16).slice(2)}`,

      ownerLabel: 'You',

      name,

      game: newDeckGame,

      cards: [],

      createdAt: Date.now(),
    };

    setDecks((previous) => [deck, ...previous]);

    setCreating(false);
    setNewDeckName('');
  };

// This adds random cards to deck
  const addRandomCardToDeck = (deckId) => {
    const deck = decks.find((item) => item.id === deckId);

    if (!deck) {
      return;
    }

    const candidates = MOCK_CARDS.filter((card) => card.game === deck.game);

    if (candidates.length === 0) {
      return;
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    setDecks((previous) =>
      previous.map((item) => {
        if (item.id !== deckId) {
          return item;
        }

        const existing = item.cards.find((card) => card.cardId === pick.id);

        if (existing) {
          return {
            ...item,

            cards: item.cards.map((card) =>
              card.cardId === pick.id
                ? {
                    ...card,
                    qty: card.qty + 1,
                  }
                : card
            ),
          };
        }

        return {
          ...item,

          cards: [
            {
              cardId: pick.id,
              qty: 1,
            },

            ...item.cards,
          ],
        };
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <View style={styles.rowBetween}>
        <Text style={styles.screenTitle}>Deck Builder</Text>

        <Text style={styles.pill}>Decks: {decks.length}</Text>
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Quick Create</Text>

      {!creating ? (
        <View style={styles.listGap}>
          <Pressable
            style={styles.buttonSmall}
            onPress={() => setCreating(true)}>
            <Text style={styles.buttonSmallText}>+ Create a New Deck</Text>
          </Pressable>

          <Text style={styles.sectionHint}>Or import a premade deck:</Text>

          <View style={styles.listGap}>
            {MOCK_PREMADE_DECKS.map((deck) => (
              <View key={deck.id} style={styles.miniRow}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text style={styles.miniTitle}>{deck.name}</Text>

                  <Text style={styles.miniMeta}>{deck.game}</Text>
                </View>

                <Pressable
                  style={styles.buttonSmall}
                  onPress={() => importPremade(deck)}>
                  <Text style={styles.buttonSmallText}>Use</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.listGap}>
          <TextInput
            style={styles.input}
            placeholder="Deck name"
            placeholderTextColor="#777"
            value={newDeckName}
            onChangeText={setNewDeckName}
          />

          <Text style={styles.sectionHint}>Game:</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalRow}>
              {['Magic: The Gathering', 'Pokémon', 'Sports Cards'].map(
                (game) => {
                  const active = newDeckGame === game;

                  return (
                    <Pressable
                      key={game}
                      onPress={() => setNewDeckGame(game)}
                      style={[styles.chip, active && styles.chipActive]}>
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}>
                        {game}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.buttonSmall, { flex: 1 }]}
              onPress={createDeck}>
              <Text style={styles.buttonSmallText}>Create</Text>
            </Pressable>

            <Pressable
              style={[
                styles.buttonSmall,
                {
                  flex: 1,
                  backgroundColor: '#6b7280',
                },
              ]}
              onPress={() => {
                setCreating(false);
                setNewDeckName('');
              }}>
              <Text style={styles.buttonSmallText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Your Decks</Text>

      <View style={styles.listGap}>
        {decks.length === 0 ? (
          <Text style={styles.emptyText}>No decks yet. Create one above.</Text>
        ) : null}

        {decks.map((deck) => {
          const cardCount = deck.cards.reduce(
            (sum, card) => sum + Number(card.qty || 0),
            0
          );

          return (
            <View key={deck.id} style={styles.deckCard}>
              <View style={styles.deckHeader}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text style={styles.deckName}>{deck.name}</Text>

                  <Text style={styles.deckMeta}>{deck.game}</Text>
                </View>

                <Text style={styles.deckCount}>{cardCount} cards</Text>
              </View>

              <View style={styles.smallList}>
                {deck.cards.length === 0 ? (
                  <Text style={styles.smallMuted}>
                    No cards in this deck yet.
                  </Text>
                ) : (
                  deck.cards.slice(0, 4).map((item, index) => {
                    const card = findCard(item.cardId);

                    if (!card) {
                      return null;
                    }

                    return (
                      <Text
                        key={`${item.cardId}-${index}`}
                        style={styles.smallMuted}>
                        • {item.qty}× {card.name}
                      </Text>
                    );
                  })
                )}

                {deck.cards.length > 4 ? (
                  <Text style={styles.smallMuted}>
                    + {deck.cards.length - 4} more...
                  </Text>
                ) : null}
              </View>

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.buttonSmall, { flex: 1 }]}
                  onPress={() => addRandomCardToDeck(deck.id)}>
                  <Text style={styles.buttonSmallText}>Add Random Card</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.buttonSmall,
                    {
                      flex: 1,
                      backgroundColor: '#ef4444',
                    },
                  ]}
                  onPress={() =>
                    setDecks((previous) =>
                      previous.filter((item) => item.id !== deck.id)
                    )
                  }>
                  <Text style={styles.buttonSmallText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}

// Screen for binder where user can add cards that they have obtain 
function BinderScreen({ binderItems, setBinderItems }) {
  const [title, setTitle] = useState('');

  const [selectedCardId, setSelectedCardId] = useState(MOCK_CARDS[0]?.id || '');

  const selectedCard = findCard(selectedCardId);

  //This is where we add card to our premade binder 

  const addPremade = () => {
    const candidates = MOCK_PREMADE_BINDER.filter(
      (premade) => !binderItems.some((item) => item.cardId === premade.cardId)
    );

    if (candidates.length === 0) {
      return;
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    setBinderItems((previous) => [
      {
        id: `binder-${Date.now()}-${Math.random().toString(16).slice(2)}`,

        title: pick.title,

        cardId: pick.cardId,
      },

      ...previous,
    ]);
  };

//this is where we add custom cards to our binder 
  const addCustomToBinder = () => {
    if (!selectedCard) {
      return;
    }

    const cardTitle = title.trim() || selectedCard.name;

    setBinderItems((previous) => [
      {
        id: `binder-${Date.now()}-${Math.random().toString(16).slice(2)}`,

        title: cardTitle,

        cardId: selectedCard.id,
      },

      ...previous,
    ]);

    setTitle('');
  };

//How we remove cards from our binder
  const removeItem = (id) => {
    setBinderItems((previous) => previous.filter((item) => item.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <View style={styles.rowBetween}>
        <Text style={styles.screenTitle}>Binder / Collection</Text>

        <Text style={styles.pill}>Items: {binderItems.length}</Text>
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Add Examples</Text>

      <View style={styles.listGap}>
        <Pressable style={styles.buttonSmall} onPress={addPremade}>
          <Text style={styles.buttonSmallText}>
            + Add a Premade Binder Card
          </Text>
        </Pressable>

        <Text style={styles.sectionHint}>Add a custom card:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalRow}>
            {MOCK_CARDS.map((card) => {
              const active = card.id === selectedCardId;

              return (
                <Pressable
                  key={card.id}
                  onPress={() => setSelectedCardId(card.id)}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}>
                    {card.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Title under the card"
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />

        <Pressable
          style={[
            styles.buttonSmall,
            {
              backgroundColor: '#111827',
            },
          ]}
          onPress={addCustomToBinder}>
          <Text style={styles.buttonSmallText}>Add to Binder</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Your Binder</Text>

      <View style={styles.listGap}>
        {binderItems.length === 0 ? (
          <Text style={styles.emptyText}>
            No cards in binder yet. Add a premade card or pick one above.
          </Text>
        ) : null}

        {binderItems.map((item) => {
          const card = findCard(item.cardId);

          return (
            <View key={item.id} style={styles.binderItem}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text style={styles.binderTitle}>{item.title}</Text>

                <Text style={styles.binderMeta}>
                  {card ? card.name : 'Unknown'}
                  {card ? ` • ${card.game}` : ''}
                </Text>

                <Text style={styles.binderMeta}>
                  Set: {card ? card.set : '-'}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.buttonSmall,
                  {
                    backgroundColor: '#ef4444',
                  },
                ]}
                onPress={() => removeItem(item.id)}>
                <Text style={styles.buttonSmallText}>Remove</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}

//Code for the events that are near user, can search by zip 
//We did 10001, 10002, 10003 etc for the mock, because it was easier to remeber 

function EventsScreen() {
  const [zip, setZip] = useState('10001');

  const zipClean = normalizeZip(zip);

  const filteredEvents = useMemo(() => {
    if (!zipClean) {
      return [];
    }

    return MOCK_EVENTS.filter((event) => event.zip === zipClean);
  }, [zipClean]);

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Text style={styles.screenTitle}>Nearby Events</Text>

      <Text style={styles.sectionHint}>
        Enter a ZIP code to see mocked tournaments, competitions, and community
        meetups.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="ZIP code"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={zip}
        onChangeText={setZip}
        maxLength={5}
      />

      <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Events</Text>

      <View style={styles.listGap}>
        {filteredEvents.length === 0 ? (
          <Text style={styles.emptyText}>
            No mocked events found for ZIP {zipClean || '—'}.
          </Text>
        ) : null}

        {filteredEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.name}</Text>

            <Text style={styles.eventMeta}>{event.type}</Text>

            <Text style={styles.eventMeta}>ZIP: {event.zip}</Text>

            <Text style={styles.smallMuted}>Tap View to expand later.</Text>

            <View style={{ height: 8 }} />

            <Pressable style={styles.buttonSmall} onPress={() => {}}>
              <Text style={styles.buttonSmallText}>View</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}

//Code for the main screen of our page 
function MainScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Shop');

  const [decks, setDecks] = useState([]);

  const [binderItems, setBinderItems] = useState([]);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cartSheetOpen, setCartSheetOpen] = useState(false);

//Where we load the saved data that we have from the user 
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [rawDecks, rawBinder, rawCart] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.decks),

          AsyncStorage.getItem(STORAGE_KEYS.binder),

          AsyncStorage.getItem(STORAGE_KEYS.cart),
        ]);

        if (!mounted) {
          return;
        }

        setDecks(rawDecks ? JSON.parse(rawDecks) : []);

        setBinderItems(rawBinder ? JSON.parse(rawBinder) : []);

        setCart(rawCart ? JSON.parse(rawCart) : []);
      } catch (error) {
        console.warn('Could not load saved data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

//This is what saves the decks the user makes
  useEffect(() => {
    if (loading) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.decks, JSON.stringify(decks)).catch(
      (error) => {
        console.warn('Could not save decks:', error);
      }
    );
  }, [decks, loading]);

//This is what saves cards in our binder 
  useEffect(() => {
    if (loading) {
      return;
    }

    AsyncStorage.setItem(
      STORAGE_KEYS.binder,
      JSON.stringify(binderItems)
    ).catch((error) => {
      console.warn('Could not save binder:', error);
    });
  }, [binderItems, loading]);

//This is what saves the items in our cart 

  useEffect(() => {
    if (loading) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart)).catch(
      (error) => {
        console.warn('Could not save cart:', error);
      }
    );
  }, [cart, loading]);

//This counts the amount of items 

  const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);


//Counts up the amount of money cart costs 
  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );
//Function to add items to your cart 

  const onAddToCart = (listing) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.listingId === listing.id);

      if (existing) {
        return previous.map((item) =>
          item.listingId === listing.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        {
          listingId: listing.id,

          cardId: listing.cardId,

          price: listing.price,

          qty: 1,
        },

        ...previous,
      ];
    });

    setActiveTab('Shop');
  };

//This is the function to decrease the amount of items in your cart 

  const decreaseCartItem = (listingId) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.listingId === listingId
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

//This is how you increase the amount of items in a cart 

  const increaseCartItem = (listingId) => {
    setCart((previous) =>
      previous.map((item) =>
        item.listingId === listingId
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

//How you logout of your user 

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.auth);

      navigation.replace('Login');
    } catch (error) {
      console.warn('Logout error:', error);
    }
  };

 //Loading screen

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.mainScreen}>
      {/* TOP BAR */}

      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>TCG Marketplace</Text>

        <Pressable
          style={styles.topBarBtn}
          onPress={() => setCartSheetOpen(true)}>
          <Text style={styles.topBarBtnText}>Cart ({cartCount})</Text>
        </Pressable>
      </View>

      {/* MAIN CONTENT */}

      <View style={{ flex: 1 }}>
        {activeTab === 'Shop' ? (
          <ShopScreen onAddToCart={onAddToCart} cartCount={cartCount} />
        ) : activeTab === 'Decks' ? (
          <DecksScreen decks={decks} setDecks={setDecks} />
        ) : activeTab === 'Binder' ? (
          <BinderScreen
            binderItems={binderItems}
            setBinderItems={setBinderItems}
          />
        ) : (
          <EventsScreen />
        )}
      </View>

      {/* BOTTOM NAVIGATION */}

      <BottomTabBar activeTab={activeTab} onSelect={setActiveTab} />

//Sheet of items in your cart 
      {cartSheetOpen ? (
        <View style={styles.cartOverlay}>
          <View style={styles.cartSheet}>
            {/* CART HEADER */}

            <View style={styles.rowBetween}>
              <Text style={styles.cartSheetTitle}>Cart</Text>

              <Pressable
                style={styles.closeBtn}
                onPress={() => setCartSheetOpen(false)}>
                <Text style={styles.closeBtnText}>X</Text>
              </Pressable>
            </View>

            <Text style={styles.smallMuted}>
              Review your cart before checkout.
            </Text>

            <View
              style={{
                height: 10,
              }}
            />

            {/* EMPTY CART */}

            {cart.length === 0 ? (
              <Text style={styles.emptyText}>
                Your cart is empty. Add an item from Shop.
              </Text>
            ) : (
              /* CART ITEMS */

              <ScrollView
                style={{
                  maxHeight: 260,
                }}>
                <View style={styles.smallList}>
                  {cart.map((item) => {
                    const card = findCard(item.cardId);

                    return (
                      <View key={item.listingId} style={styles.cartItem}>
                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text style={styles.cartItemTitle}>
                            {card ? card.name : item.cardId}
                          </Text>

                          <Text style={styles.cartItemMeta}>
                            Qty: {item.qty} • {formatMoney(item.price)} each
                          </Text>

                          <Text style={styles.cartItemMeta}>
                            Line total: {formatMoney(item.price * item.qty)}
                          </Text>
                        </View>

                        {/* MINUS BUTTON */}

                        <Pressable
                          style={[
                            styles.buttonSmall,
                            {
                              backgroundColor: '#6b7280',

                              paddingVertical: 10,
                            },
                          ]}
                          onPress={() => decreaseCartItem(item.listingId)}>
                          <Text style={styles.buttonSmallText}>-</Text>
                        </Pressable>

                        {/* PLUS BUTTON */}

                        <Pressable
                          style={[
                            styles.buttonSmall,
                            {
                              backgroundColor: '#111827',

                              paddingVertical: 10,
                            },
                          ]}
                          onPress={() => increaseCartItem(item.listingId)}>
                          <Text style={styles.buttonSmallText}>+</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}

            <View
              style={{
                height: 10,
              }}
            />

            {/* TOTAL */}

            <Text style={styles.cartTotal}>
              Total: {formatMoney(cartTotal)}
            </Text>

            {/* CART BUTTONS */}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.buttonSmall,
                  {
                    flex: 1,
                    backgroundColor: '#ef4444',
                  },
                ]}
                onPress={() => setCart([])}>
                <Text style={styles.buttonSmallText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonSmall,
                  {
                    flex: 1,
                  },
                ]}
                onPress={() => {
                  // Mock checkout

                  if (cart.length === 0) {
                    return;
                  }

                  setCart([]);

                  setCartSheetOpen(false);

                  setActiveTab('Shop');
                }}>
                <Text style={styles.buttonSmallText}>Pay</Text>
              </TouchableOpacity>
            </View>

            {/* LOGOUT */}

            <TouchableOpacity
              style={[
                styles.buttonSmall,
                {
                  backgroundColor: '#374151',
                },
              ]}
              onPress={logout}>
              <Text style={styles.buttonSmallText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
//The actual app part of the function 

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.auth);

        setInitialRoute(token ? 'Main' : 'Login');
      } catch (error) {
        console.warn('Could not check authentication:', error);

        setInitialRoute('Login');
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//Styles part of the app 

const styles = StyleSheet.create({
//Screen styles 
  loginScreen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },

  mainScreen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
//text styles 
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#4b5563',
  },
//container style 
  container_view: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  screenPad: {
    padding: 16,
    paddingBottom: 30,
  },

//Text styles 

  title_text: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  sectionHint: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 19,
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  smallMuted: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },

  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },

//Input styles 

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
  },

  input_view: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#111827',
  },

//login styles 

  login_button: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },

  button_text: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },

//Top bar styles 

  topBar: {
    minHeight: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  topBarBtn: {
    backgroundColor: '#111827',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  topBarBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

//Row styles 

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  horizontalRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  listGap: {
    gap: 10,
  },

  smallList: {
    gap: 4,
  },
//Button Styles 

  buttonSmall: {
    backgroundColor: '#111827',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSmallText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtnText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },

//Chip styles 

  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  chipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  chipText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  chipTextActive: {
    color: '#ffffff',
  },
//Pill styles 

  pill: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },

  cartPill: {
    backgroundColor: '#111827',
    color: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },

//Shop styles 

  cardListing: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardListingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5,
  },

  cardListingMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },


  //Deck styles 

  deckCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },

  deckHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  deckName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },

  deckMeta: {
    marginTop: 3,
    fontSize: 12,
    color: '#6b7280',
  },

  deckCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },

  miniRow: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  miniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  miniMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
  },

 //Binder Styles 

  binderItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  binderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  binderMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
  },

//Event Styles 

  eventCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5,
  },

  eventMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },

//Bottom tab bar styles 

  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },

  tabBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },

  tabBtnActive: {
    backgroundColor: '#111827',
  },

  tabText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
  },

  tabTextActive: {
    color: '#ffffff',
  },

//Cart styles 

  cartOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },

  cartSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 24,
    maxHeight: '85%',
  },

  cartSheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  cartItem: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cartItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  cartItemMeta: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },

  cartTotal: {
    fontSize: 21,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
});
