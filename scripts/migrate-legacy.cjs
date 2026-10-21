/* Dry-run: node scripts/migrate-legacy.cjs mapping.json
 * Apply:   node scripts/migrate-legacy.cjs mapping.json --apply
 * Mapping: { "old-document-id": "existing-firebase-auth-uid" }
 * Requires Admin SDK credentials and a backup. Never run in a browser.
 */
const admin = require("firebase-admin");
const fs = require("node:fs");
async function main() {
  const mappingPath = process.argv[2];
  if (!mappingPath)
    throw new Error(
      "Provide an old-document-id to existing Auth UID mapping file.",
    );
  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping))
    throw new Error("The mapping must be a JSON object.");
  const destinations = Object.values(mapping);
  if (
    destinations.some(
      (value) => typeof value !== "string" || !value || value.includes("/"),
    ) ||
    new Set(destinations).size !== destinations.length
  )
    throw new Error(
      "Auth UIDs must be unique nonempty strings without slashes.",
    );
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
  const db = admin.firestore();
  const snapshot = await db.collection("users").get();
  const ids = new Set(snapshot.docs.map((doc) => doc.id));
  for (const source of Object.keys(mapping))
    if (!ids.has(source))
      throw new Error("A mapped source profile does not exist.");
  const remap = (id) => {
    if (!mapping[id])
      throw new Error("Every referenced user needs an explicit mapping.");
    return mapping[id];
  };
  const operations = [];
  for (const doc of snapshot.docs) {
    const uid = remap(doc.id);
    if (uid !== doc.id && ids.has(uid))
      throw new Error(
        "A target UID collides with another existing profile. Resolve before migration.",
      );
    const original = doc.data();
    const authUser = await admin.auth().getUser(uid);
    if (
      (authUser.email || "").toLowerCase() !==
      (original.email || "").trim().toLowerCase()
    )
      throw new Error("An Auth UID does not match its source profile email.");
    const { password, confirmPassword, ...profile } = original;
    profile.docId = uid;
    for (const key of ["players", "trainers", "doctors"])
      if (Array.isArray(profile[key]))
        profile[key] = profile[key].map((item) =>
          typeof item === "string"
            ? remap(item)
            : { ...item, userId: remap(item.userId) },
        );
    const directory = {};
    for (const key of [
      "name",
      "image",
      "occupation",
      "level",
      "experience",
      "achivement",
      "specialization",
      "clinicAddress",
      "clinicTiming",
      "weekend",
      "clinicPhoneNumber",
    ])
      if (profile[key] !== undefined) directory[key] = profile[key];
    operations.push(
      ["set", db.collection("users").doc(uid), profile],
      ["set", db.collection("directory").doc(uid), directory],
    );
    if (uid !== doc.id)
      operations.push(
        ["delete", doc.ref],
        ["delete", db.collection("directory").doc(doc.id)],
      );
  }
  const prompts = await db.collection("prompts").get();
  for (const doc of prompts.docs) {
    const userId = doc.data().userId;
    if (mapping[userId] && mapping[userId] !== userId)
      operations.push(["update", doc.ref, { userId: mapping[userId] }]);
  }
  if (operations.length > 500)
    throw new Error(
      "Migration exceeds one atomic batch. Use a dedicated migration service for this dataset.",
    );
  console.log(
    `Validated ${snapshot.size} profiles and ${operations.length} atomic operations.`,
  );
  if (!process.argv.includes("--apply")) {
    console.log("Dry run complete. No data changed.");
    return;
  }
  const batch = db.batch();
  for (const [kind, ref, data] of operations) {
    if (kind === "delete") batch.delete(ref);
    else batch[kind](ref, data);
  }
  await batch.commit();
  console.log(
    "Migration committed. Profile password fields removed; links and directories rebuilt.",
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
