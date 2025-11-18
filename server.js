import express from "express";
import path from "path";
import config from "../config.json" assert { type: "json" };

export function startDashboard(client) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.resolve("dashboard/public")));

  app.get("/api/stats", (req, res) => {
    const guild = client.guilds.cache.first();
    res.json({
      members: guild ? guild.memberCount : 0,
      channels: client.channels.cache.size,
      botStatus: client.user ? "online" : "offline"
    });
  });

  app.get("/api/logs", (req, res) => {
    res.json(global.botLogs || []);
  });

  app.get("/api/tickets", (req, res) => {
    import("../modules/tickets.js").then(m => {
      res.json(m.getOpenTickets());
    }).catch(e=>res.json({error:String(e)}));
  });

  app.get("/api/warnings", (req, res) => {
    import("../modules/moderation.js").then(m => {
      res.json(m.getWarnings());
    }).catch(e=>res.json({error:String(e)}));
  });

  app.post("/api/command", (req, res) => {
    const command = req.body.command || "";
    const guild = client.guilds.cache.first();
    const ch = guild ? guild.systemChannel : null;
    if (ch) ch.send(`📌 Dashboard Command:\n${command}`);
    res.json({ status: "ok" });
  });

  app.listen(config.dashboard_port, () => {
    console.log(`Dashboard running on port ${config.dashboard_port}`);
  });
}
