export type User = {
  id: number;
  name: string;
  age: number;
};

export const UserUtils = {
  /**
   * Returns true if the oldest user is at least twice as old as the youngest user.
   */
  // O(n) Time and O(1) Space
  AtLeastTwice: (users: User[]): boolean => {
    if (users.length < 2) return false;
    let min = users[0].age;
    let max = users[0].age;

    for (let i = 1; i < users.length; i++) {
      if (users[i].age < min) min = users[i].age;
      if (users[i].age > max) max = users[i].age;
    }
    return max >= 2 * min;
  },

  /**
   * Returns true if there exist two users whose ages are exactly twice each other.
   */
  // O(n) Time and O(n) Space
  ExactlyTwice: (users: User[]): boolean => {
    const seenAges = new Set<number>();

    for (const { age } of users) {
      if (seenAges.has(age * 2) || (age % 2 === 0 && seenAges.has(age / 2)))
        return true;
      seenAges.add(age);
    }
    return false;
  },

  /**
   * Returns true if there exist two users whose ages are exactly twice each other, with the constraint that ages are between 18 and 80.
   */
  // O(n) Time and O(1) Space
  ConstrainedExactlyTwice: (users: User[]): boolean => {
    const seenAges = new Uint8Array(81);

    for (const { age } of users) {
      if (age <= 40 && seenAges[age * 2]) return true;

      if (age % 2 === 0 && seenAges[age / 2]) return true;

      seenAges[age] = 1;
    }

    return false;
  },
};
