import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useChoirStore = defineStore("choir", () => {
  // Members Data
  const members = ref([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Soprano",
      image: "https://i.pravatar.cc/150?img=1",
      joinDate: "2020-03-15",
      bio: "Lead soprano with 10 years experience",
    },
    {
      id: 2,
      name: "Emily Davis",
      role: "Soprano",
      image: "https://i.pravatar.cc/150?img=5",
      joinDate: "2021-01-20",
      bio: "Classically trained soprano",
    },
    {
      id: 3,
      name: "Maria Garcia",
      role: "Soprano",
      image: "https://i.pravatar.cc/150?img=9",
      joinDate: "2019-09-10",
      bio: "Opera singer and vocal coach",
    },
    {
      id: 4,
      name: "Lisa Anderson",
      role: "Alto",
      image: "https://i.pravatar.cc/150?img=2",
      joinDate: "2020-06-15",
      bio: "Jazz and classical alto",
    },
    {
      id: 5,
      name: "Rachel Brown",
      role: "Alto",
      image: "https://i.pravatar.cc/150?img=6",
      joinDate: "2021-04-22",
      bio: "Contemporary music specialist",
    },
    {
      id: 6,
      name: "Jennifer Wilson",
      role: "Alto",
      image: "https://i.pravatar.cc/150?img=10",
      joinDate: "2019-11-30",
      bio: "Choral music educator",
    },
    {
      id: 7,
      name: "Michael Thompson",
      role: "Tenor",
      image: "https://i.pravatar.cc/150?img=3",
      joinDate: "2020-08-01",
      bio: "Lead tenor and soloist",
    },
    {
      id: 8,
      name: "David Martinez",
      role: "Tenor",
      image: "https://i.pravatar.cc/150?img=7",
      joinDate: "2021-02-14",
      bio: "Musical theater performer",
    },
    {
      id: 9,
      name: "James Wilson",
      role: "Bass",
      image: "https://i.pravatar.cc/150?img=4",
      joinDate: "2019-05-20",
      bio: "Bass vocalist and composer",
    },
    {
      id: 10,
      name: "Robert Clark",
      role: "Bass",
      image: "https://i.pravatar.cc/150?img=8",
      joinDate: "2020-11-11",
      bio: "Professional bass singer",
    },
    {
      id: 11,
      name: "Daniel Lee",
      role: "Tenor",
      image: "https://i.pravatar.cc/150?img=11",
      joinDate: "2021-07-18",
      bio: "Countertenor specialist",
    },
    {
      id: 12,
      name: "Catherine White",
      role: "Soprano",
      image: "https://i.pravatar.cc/150?img=12",
      joinDate: "2022-01-05",
      bio: "Young emerging soprano talent",
    },
  ]);

  // Events Data
  const events = ref([
    {
      id: 1,
      title: "Spring Harmony Concert 2026",
      date: "2026-08-15",
      time: "19:30",
      venue: "Grand Opera House",
      location: "New York City",
      description: "Our annual spring concert featuring classical and contemporary pieces",
      image: "https://picsum.photos/800/400?random=1",
      tickets: "Available",
    },
    {
      id: 2,
      title: "Christmas Carol Spectacular",
      date: "2026-12-20",
      time: "18:00",
      venue: "St. Patrick's Cathedral",
      location: "Boston",
      description: "Traditional Christmas carols and holiday favorites",
      image: "https://picsum.photos/800/400?random=2",
      tickets: "Coming Soon",
    },
    {
      id: 3,
      title: "International Choir Festival",
      date: "2026-09-25",
      time: "14:00",
      venue: "Lincoln Center",
      location: "New York City",
      description: "Participating in the prestigious International Choir Festival",
      image: "https://picsum.photos/800/400?random=3",
      tickets: "On Sale",
    },
    {
      id: 4,
      title: "Summer Evening Recital",
      date: "2026-07-10",
      time: "20:00",
      venue: "Riverside Park Amphitheater",
      location: "Chicago",
      description: "Outdoor summer recital featuring light classical and popular music",
      image: "https://picsum.photos/800/400?random=4",
      tickets: "Sold Out",
    },
  ]);

  // Gallery Data
  const gallery = ref([
    {
      id: 1,
      title: "Spring Concert 2025",
      image: "https://picsum.photos/600/400?random=10",
      category: "Concert",
      date: "2025-03-20",
    },
    {
      id: 2,
      title: "Rehearsal Session",
      image: "https://picsum.photos/600/400?random=11",
      category: "Behind Scenes",
      date: "2025-06-15",
    },
    {
      id: 3,
      title: "Christmas Performance",
      image: "https://picsum.photos/600/400?random=12",
      category: "Concert",
      date: "2025-12-24",
    },
    {
      id: 4,
      title: "Group Photo",
      image: "https://picsum.photos/600/400?random=13",
      category: "Group",
      date: "2025-01-10",
    },
    {
      id: 5,
      title: "Award Ceremony",
      image: "https://picsum.photos/600/400?random=14",
      category: "Event",
      date: "2025-09-05",
    },
    {
      id: 6,
      title: "Summer Festival",
      image: "https://picsum.photos/600/400?random=15",
      category: "Festival",
      date: "2025-07-20",
    },
    {
      id: 7,
      title: "Recording Session",
      image: "https://picsum.photos/600/400?random=16",
      category: "Behind Scenes",
      date: "2025-04-12",
    },
    {
      id: 8,
      title: "Community Performance",
      image: "https://picsum.photos/600/400?random=17",
      category: "Community",
      date: "2025-08-30",
    },
    {
      id: 9,
      title: "Workshop",
      image: "https://picsum.photos/600/400?random=18",
      category: "Education",
      date: "2025-05-25",
    },
  ]);

  // Library Data
  const library = ref([
    {
      id: 1,
      title: "Ave Maria",
      composer: "Franz Schubert",
      genre: "Classical",
      difficulty: "Intermediate",
      year: "1825",
      pdf: "#",
    },
    {
      id: 2,
      title: "Hallelujah Chorus",
      composer: "G.F. Handel",
      genre: "Baroque",
      difficulty: "Advanced",
      year: "1741",
      pdf: "#",
    },
    {
      id: 3,
      title: "Bohemian Rhapsody",
      composer: "Queen",
      genre: "Contemporary",
      difficulty: "Advanced",
      year: "1975",
      pdf: "#",
    },
    {
      id: 4,
      title: "Canon in D",
      composer: "Johann Pachelbel",
      genre: "Classical",
      difficulty: "Beginner",
      year: "1680",
      pdf: "#",
    },
    {
      id: 5,
      title: "Amazing Grace",
      composer: "John Newton",
      genre: "Gospel",
      difficulty: "Beginner",
      year: "1779",
      pdf: "#",
    },
    {
      id: 6,
      title: "O Fortuna",
      composer: "Carl Orff",
      genre: "Classical",
      difficulty: "Advanced",
      year: "1936",
      pdf: "#",
    },
    {
      id: 7,
      title: "Seasons of Love",
      composer: "Jonathan Larson",
      genre: "Musical",
      difficulty: "Intermediate",
      year: "1996",
      pdf: "#",
    },
    {
      id: 8,
      title: "The Lion Sleeps Tonight",
      composer: "Solomon Linda",
      genre: "World",
      difficulty: "Beginner",
      year: "1939",
      pdf: "#",
    },
  ]);

  // Computed
  const memberRoles = computed(() => ({
    soprano: members.value.filter((m) => m.role === "Soprano").length,
    alto: members.value.filter((m) => m.role === "Alto").length,
    tenor: members.value.filter((m) => m.role === "Tenor").length,
    bass: members.value.filter((m) => m.role === "Bass").length,
    total: members.value.length,
  }));

  const upcomingEvents = computed(() => {
    return events.value
      .filter((e) => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return { members, events, gallery, library, memberRoles, upcomingEvents };
});
